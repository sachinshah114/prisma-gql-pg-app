import { BadRequestException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
const saltRounds = 10;

export async function EncryptPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw new BadRequestException('Password encryption issue');
  }
}
