export const generateToken = () =>
  Math.floor(Math.random() * (10000 - 1000) + 1000);

export const TOKENS = {
  member: generateToken(),
  admin: generateToken(),
};
