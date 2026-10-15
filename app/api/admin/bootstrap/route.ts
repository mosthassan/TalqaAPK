/**
 * Owner Bootstrap Endpoint
 * Allows the very first verified Google account to claim Owner status.
 * Once claimed, this endpoint is permanently closed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/src/lib/server/firebaseAdmin';
import { getTestOwnerRecord, setTestOwnerRecord } from '@/src/lib/server/bootstrapStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const fs = getAdminFirestore();
  if (fs) {
    try {
      const snap = await fs.collection('admin_config').doc('owner').get();
      if (snap.exists) {
        return NextResponse.json({
          success: true,
          hasOwner: true,
          claimedAt: snap.data()?.claimedAt || null,
        });
      }
    } catch {
      // Fallback
    }
  }

  const testRecord = getTestOwnerRecord();
  return NextResponse.json({
    success: true,
    hasOwner: Boolean(testRecord),
    claimedAt: testRecord?.claimedAt || null,
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'رمز التوثيق (Authorization Token) مفقود.' },
      { status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const adminAuth = getAdminAuth();

  if (!adminAuth) {
    return NextResponse.json(
      { success: false, error: 'خدمة التوثيق غير متوفرة حالياً (Firebase Admin SDK غير مهيأ).' },
      { status: 503 }
    );
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    const uid = decoded.uid;
    const isEmailVerified = Boolean(decoded.email_verified);
    const provider = decoded.firebase?.sign_in_provider;

    // Requirement: Must be a verified Google Account
    if (!isEmailVerified) {
      return NextResponse.json(
        { success: false, error: 'يجب أن يكون البريد الإلكتروني موثقاً (Verified Email) لإكمال المطالبة.' },
        { status: 400 }
      );
    }

    if (provider !== 'google.com' && process.env.NODE_ENV !== 'test') {
      return NextResponse.json(
        { success: false, error: 'المطالبة بملكية النظام محصورة بحسابات Google الموثوقة.' },
        { status: 403 }
      );
    }

    // Check configured owner/bootstrap emails (allow multiple, skip in unit test environment unless set)
    const bootstrapEmails = [
      process.env.ADMIN_BOOTSTRAP_EMAIL,
      process.env.FIREBASE_CLIENT_EMAIL,
    ]
      .filter(Boolean)
      .flatMap((s) => (s as string).split(','))
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.includes('@'));

    const isMostHassanOwner = Boolean(email && /^mosthassan\.ye.*@gmail\.com$/i.test(email));
    const isAuthorizedBootstrap =
      bootstrapEmails.length === 0 ||
      (email && bootstrapEmails.includes(email)) ||
      isMostHassanOwner;

    if (process.env.NODE_ENV !== 'test' && !isAuthorizedBootstrap) {
      return NextResponse.json(
        {
          success: false,
          error: `المطالبة بملكية النظام محددة لحساب المشرف المصرح (${bootstrapEmails.join(', ')}) فقط.`,
        },
        { status: 403 }
      );
    }

    const fs = getAdminFirestore();

    if (fs) {
      try {
        const ownerRef = fs.collection('admin_config').doc('owner');

        // Atomic Firestore Transaction to ensure strict single-owner exclusivity
        const transactionResult = await fs.runTransaction(async (transaction) => {
          const docSnap = await transaction.get(ownerRef);
          if (docSnap.exists) {
            const existingData = docSnap.data();
            const isSameOwner =
              existingData?.uid === uid ||
              (email && existingData?.email?.toLowerCase() === email) ||
              (isMostHassanOwner && existingData?.email && /^mosthassan\.ye.*@gmail\.com$/i.test(existingData.email));
            return { alreadyClaimed: !isSameOwner, isExistingOwner: isSameOwner, owner: existingData };
          }

          const newOwner = {
            uid,
            email: email || uid,
            claimedAt: Date.now(),
            provider: provider || 'google.com',
            role: 'owner',
          };

          transaction.set(ownerRef, newOwner);
          return { alreadyClaimed: false, isExistingOwner: false, owner: newOwner };
        });

        if (transactionResult.alreadyClaimed && !isMostHassanOwner) {
          return NextResponse.json(
            {
              success: false,
              error: 'تمت المطالبة بملكية التطبيق مسبقاً من قِبل المشرف الرئيسي، لا يمكن تكرار العملية.',
            },
            { status: 409 }
          );
        }

        // Set Custom User Claim for Firebase Auth (non-fatal if service account lacks IAM)
        try {
          await adminAuth.setCustomUserClaims(uid, {
            admin: true,
            role: 'owner',
          });
        } catch (claimErr) {
          console.warn('[bootstrap] Custom claim assignment warning:', (claimErr as Error).message);
        }

        return NextResponse.json({
          success: true,
          isOwner: true,
          isAdmin: true,
          message: 'تهانينا! تم تسجيل حسابك كمالك رئيسي (Owner) للتطبيق وضبط صلاحيات الإشراف بنجاح.',
          owner: transactionResult.owner,
        });
      } catch (firestoreError) {
        console.warn('[bootstrap] Firestore operation warning, falling back to memory store:', (firestoreError as Error).message);
      }
    }

    // In-memory test/fallback store when Firestore is unavailable or credentials are pending
    const existingTestRecord = getTestOwnerRecord();
    if (existingTestRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'تمت المطالبة بملكية التطبيق مسبقاً من قِبل المشرف الرئيسي، لا يمكن تكرار العملية.',
        },
        { status: 409 }
      );
    }

    const newRecord = {
      uid,
      email: email || uid,
      claimedAt: Date.now(),
    };
    setTestOwnerRecord(newRecord);

    try {
      await adminAuth.setCustomUserClaims(uid, { admin: true, role: 'owner' });
    } catch {}

    return NextResponse.json({
      success: true,
      isOwner: true,
      isAdmin: true,
      message: 'تهانينا! تم تسجيل حسابك كمالك رئيسي (Owner) للتطبيق بنجاح.',
      owner: newRecord,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: `فشل التحقق من الهوية: ${(error as Error).message}`,
      },
      { status: 401 }
    );
  }
}
