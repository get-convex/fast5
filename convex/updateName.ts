import { mutation } from './_generated/server';
import { getUser } from './common';

export default mutation(async ({ db, auth }, name: string) => {
  const user = (await getUser(db, auth))!;
  user.displayName = name;
  await db.patch(user._id, user);
});
