import { User } from '../lib/game/proto';

export const getUser = async (db: any, auth: any): Promise<User> => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error(
      'Unauthenticated call to function requiring authentication'
    );
  }
  const user = await db
    .table('users')
    .filter((q: any) =>
      q.eq(q.field('tokenIdentifier'), identity.tokenIdentifier)
    )
    .unique();
  return user;
};
