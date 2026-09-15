/**
 * HASH CHAIN
 * Client-side SHA-256 receipt hashing using Web Crypto API.
 * Each receipt is canonicalised to JSON, hashed, and linked to the previous hash.
 * This is real cryptography in the browser — and honest about being a prototype
 * demonstration, not a production security certification.
 */

/**
 * Minimal fields a ledger entry must carry to be hash-linked.
 * Canonical JSON uses these sorted keys, so the hash commits to
 * actor, action, purpose, scope, time and linkage.
 */
export interface HashableReceipt {
  id: string;
  timestamp: string;
  action: string;
  actor?: string;
  accessor?: string;
  purpose: string;
  scope: string;
  expiresAt: string | null;
  previousHash: string | null;
}

/** Anything with the hashed fields qualifies — extra fields are ignored by canonicalise. */
export type HashableLike = Omit<HashableReceipt, 'accessor' | 'actor'> &
  Partial<Pick<HashableReceipt, 'accessor' | 'actor'>> & { hash: string };

function canonicalise(receipt: HashableLike): string {
  // Deterministic JSON serialisation — hashed keys sorted, no whitespace.
  // Missing optional fields are recorded as null so omission is unambiguous.
  const keys = ['id', 'timestamp', 'action', 'accessor', 'actor', 'purpose', 'scope', 'expiresAt', 'previousHash'];
  const r = receipt as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of keys) out[k] = r[k] ?? null;
  return JSON.stringify(out);
}

async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeHash(receipt: HashableLike): Promise<string> {
  return sha256Hex(canonicalise(receipt));
}

/**
 * Verify a receipt chain end-to-end:
 *  1. every receipt's recorded hash matches a fresh hash of its own content, and
 *  2. every receipt's previousHash links to the recorded hash of the one before it.
 * Returns the index of the first broken link, or null when the chain is intact.
 */
export async function verifyLedger(receipts: HashableLike[]): Promise<{ valid: boolean; brokenAt: number | null }> {
  let prev: string | null = null;
  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i];
    // Linkage: this receipt must commit to the previous receipt's recorded hash.
    if ((r.previousHash ?? null) !== prev) return { valid: false, brokenAt: i };
    // Integrity: the recorded hash must match a fresh hash of the content.
    const fresh = await computeHash({ ...r, previousHash: prev });
    if (r.hash !== fresh) return { valid: false, brokenAt: i };
    prev = r.hash;
  }
  return { valid: true, brokenAt: null };
}

export function truncateHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}…${hash.slice(-chars)}`;
}
