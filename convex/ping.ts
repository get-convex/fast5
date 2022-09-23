import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';
import { getUser } from './common';

export default mutation(async ({ db, auth }, gameId: Id) => {
  const user = await getUser(db, auth);
  var game = await db.get(gameId);

  const now = Math.floor(Date.now() / 1000);

  if (game.user1.equals(user._id)) {
    game.user1Ping = now;
  } else if (game.user2 !== undefined && game.user2.equals(user._id)) {
    game.user2Ping = now;
  }
  db.patch(game._id, game);
});
