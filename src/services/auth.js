import createHttpError from 'http-errors';
import { UsersCollection } from '../models/User.js';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/auth.js';
import { randomBytes } from 'node:crypto';

export const registerUser = async payload => {
  const { email, password } = payload;

  const user = await UsersCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async payload => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'User not found');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Not valid email or password');

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  const newSession = createSession();
  const userId = session.userId;
  console.log(userId);

  await SessionsCollection.deleteOne({ _id: session.sessionId, refreshToken });

  return await SessionsCollection.create({
    userId,
    ...newSession,
  });
};

export const logoutUserSession = async sessionId => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
