import { v } from 'convex/values';
import { withUser } from './lib/withUser';
import { mutation } from './_generated/server';

export default mutation({
  args: { gameName: v.string() },
  handler: withUser(async ({ db, user }, { gameName }) => {
    var gameName = gameName.toLocaleLowerCase().trim();

    var existing = await db
      .query('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (existing === null) {
      return null; // This is not the place to create games.
    }
    if (user._id.equals(existing.user1) || user._id.equals(existing.user2)) {
      return existing._id; // They're already in.
    }
    if (existing.user2 !== undefined) {
      return null; // Already two players in the game!
    }
    db.patch(existing._id, {
      user2: user._id,
      ready: true,
    });
    var id = existing._id;

    // We joined the game!
    console.log(`id is ${id}`);
    return id;
  }),
});
