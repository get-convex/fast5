import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { withUser } from './lib/withUser';

export default mutation({
  args: { name: v.string() },
  handler: withUser(async ({ db, user }, { name }) => {
    await db.patch(user._id, { displayName: name });
  }),
});
