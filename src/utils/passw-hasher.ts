export const hashPassword = async (password: string): Promise<string> => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const bcrypt = require('bcrypt');
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const bcrypt = require('bcrypt');
  return bcrypt.compareSync(password, hashedPassword);
};
