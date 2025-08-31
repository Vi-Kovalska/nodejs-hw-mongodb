import createHttpError from 'http-errors';
import { UsersCollection } from '../models/User.js';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/auth.js';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
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

export const requestResetToken = async email => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
  const domain = getEnvVar('APP_DOMAIN');
  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${domain}?token=${resetToken}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async payload => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
