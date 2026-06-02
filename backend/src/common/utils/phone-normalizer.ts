import { BadRequestException } from '@nestjs/common';

export function normalizeIndianPhoneNumber(phone: string): string {
  // Remove spaces, dashes, brackets
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Remove +91 or 91 if present at the start
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }

  // Validate 10-digit Indian mobile numbers starting with 6, 7, 8, 9
  const isValid = /^[6-9]\d{9}$/.test(cleaned);
  if (!isValid) {
    throw new BadRequestException('Invalid Indian mobile number');
  }

  return `+91${cleaned}`;
}
