const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

// shortcut: 6 chars = ~1B combinations, collision risk ~0.5% at 100k rooms
// Upgrade to 8 chars for production scale (1T combinations, near-zero collision)
export function generateInviteCode(length = 8) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
