import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { defaultGame, getUser, randomGameName } from './common';

export default mutation(async ({ db, auth }): Promise<string | null> => {
  const user = await getUser(db, auth);

  var waiting = await db
    .table('games')
    .filter((q) =>
      q.and(
        q.eq(q.field('public'), true),
        q.neq(q.field('user1'), user._id),
        q.eq(q.field('ready'), false),
        q.eq(q.field('abandoned'), false)
      )
    )
    .first();
  if (waiting !== null) {
    waiting.user2 = user._id;
    waiting.ready = true;
    return waiting.name;
  }

  // No one waiting? Well, let's create one...
  while (true) {
    var gameName = randomGameName();

    var existing = await db
      .table('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (existing === null) {
      // We're creating the game!
      break;
    }
  }
  const game = defaultGame(gameName, user, true);
  await db.insert('games', game);
  return gameName;
});
