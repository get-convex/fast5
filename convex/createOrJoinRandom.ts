import { mutation } from './_generated/server';
import { withUser, TIMEOUT_THRESHOLD } from './common';
import { createGameHelper } from './createGame';

export default mutation(
  withUser(async ({ db, user }): Promise<string | null> => {
    const now = Math.floor(Date.now() / 1000);
    const validLastPing = now - TIMEOUT_THRESHOLD;

    // TODO -- use an index for this eventually!
    var waiting = await db
      .query('games')
      .filter((q) =>
        q.and(
          q.eq(q.field('public'), true),
          q.neq(q.field('user1'), user._id),
          q.eq(q.field('ready'), false),
          q.eq(q.field('abandoned'), false),
          q.gt(q.field('user1Ping'), validLastPing)
        )
      )
      .first();
    if (waiting !== null) {
      await db.patch(waiting._id, {
        user2: user._id,
        ready: true,
      });
      return waiting.name;
    }

    // No one waiting? Well, let's create one...
    return createGameHelper(db, user, true);
  })
);
