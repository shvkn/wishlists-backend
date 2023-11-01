import * as bcrypt from 'bcrypt';

export function compare(data: string, hash: string) {
  return bcrypt.compare(data, hash);
}

export function hash(data: string) {
  return bcrypt.hashSync(data, bcrypt.genSaltSync());
}
