import { mutation } from 'convex-dev/server';
import { getUser } from './common';

export default mutation(async ({ db, auth }, name: string) => {
  var user = await getUser(db, auth);
  user.displayName = name;
  await db.replace(user._id, user);
});
