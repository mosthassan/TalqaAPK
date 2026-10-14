import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/src/lib/server/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.isAdmin) {
    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
        isOwner: false,
        error: auth.error || 'هذا الحساب ليس لديه صلاحيات الإشراف في شبكة طلقة نت.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    isAdmin: true,
    isOwner: Boolean(auth.isOwner),
    email: auth.email,
    uid: auth.uid,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
