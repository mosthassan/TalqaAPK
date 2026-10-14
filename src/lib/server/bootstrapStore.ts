/**
 * In-memory test store for Owner Bootstrap during unit tests without live Firestore
 */

export interface TestOwnerRecord {
  uid: string;
  email: string;
  claimedAt: number;
}

let testOwnerRecord: TestOwnerRecord | null = null;

export function getTestOwnerRecord(): TestOwnerRecord | null {
  return testOwnerRecord;
}

export function setTestOwnerRecord(record: TestOwnerRecord | null): void {
  testOwnerRecord = record;
}

export function resetTestOwnerRecordForTesting(): void {
  testOwnerRecord = null;
}
