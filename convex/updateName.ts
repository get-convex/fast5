import { mutationWithUser } from './lib/withUser';

export default mutationWithUser(async ({ db, user }, name: string) => {
  user.displayName = name;
  await db.patch(user._id, user);
});
