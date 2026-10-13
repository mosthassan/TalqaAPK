import { describe, it, expect } from 'vitest';
import { PRIZES, validateCards, prizeRotation } from '@/lib/rewards';
describe('Network rewards', () => {
 it('requires exactly ten used cards', () => { expect(validateCards(Array.from({length:9},(_,i)=>String(i)))).not.toBeNull(); expect(validateCards(Array.from({length:10},(_,i)=>String(i)))).toBeNull(); expect(validateCards(Array.from({length:11},(_,i)=>String(i)))).not.toBeNull(); });
 it('rejects duplicate cards',()=>expect(validateCards(Array(10).fill('123'))).not.toBeNull());
 it('offers only 200 500 and 1000 and points to the awarded sector',()=>{ expect(PRIZES).toEqual([200,500,1000]); PRIZES.forEach((value,index)=>{const angle=(360-prizeRotation(value)%360)%360; expect(Math.floor(angle/120)).toBe(index);}); expect(()=>prizeRotation(300)).toThrow(); });
});
