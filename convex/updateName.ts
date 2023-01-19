import { mutation } from './_generated/server';
import { withUser } from './common';

export default mutation(
  withUser(async ({ db, user }, name: string) => {
    user.displayName = name;
    await db.patch(user._id, user);
  })
);
