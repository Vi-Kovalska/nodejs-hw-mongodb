import { UsersCollection } from '../models/User.js';
import { SessionsCollection } from '../models/Session.js';
import createHttpError from 'http-errors';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader)
    return next(createHttpError(401, 'Please provide Authorization header'));

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer')
    return next(createHttpError(401, 'Auth header should be of type Bearer!'));

  const session = await SessionsCollection.findOne({ accessToken });
  if (!session) return next(createHttpError(401, 'Session not found'));

  const isAccessTokenExpired = new Date(
    Date.now() > session.accessTokenValidUntil,
  );
  if (!isAccessTokenExpired)
    return next(createHttpError(401, 'Access token expired!'));

  const user = await UsersCollection.findOne({ _id: session.userId });
  if (!user) return next(createHttpError(401));

  req.user = user;

  next();
};
