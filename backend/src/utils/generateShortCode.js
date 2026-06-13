// Utility to generate unique short codes for URLs

const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');

const SHORT_CODE_LENGTH = 7;

/**
 * Generates a unique short code by checking against existing records.
 * Retries with a new code if a collision is found (extremely unlikely with nanoid).
 * @returns {Promise<string>} a unique short code
 */
async function generateUniqueShortCode() {
  let shortCode;
  let exists = true;

  // Loop until a unique code is found
  while (exists) {
    shortCode = nanoid(SHORT_CODE_LENGTH);
    const existing = await prisma.url.findUnique({ where: { shortCode } });
    exists = !!existing;
  }

  return shortCode;
}

module.exports = { generateUniqueShortCode };
