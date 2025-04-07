import dotenv from 'dotenv';
dotenv.config();
export const getEnvVar = (name, defoultValue) => {
  const value = process.env[name];

  if (value) return value;
  if (defoultValue) return defoultValue;
  throw new Error(`Missing: process.env[${name}]`);
};
