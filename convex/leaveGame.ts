import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { abandonGame, getUser } from './common';

const LEAVE_PENALTY = 100;

export default mutation(async ({ db, auth }, gameId: Id) => {
  const user = await getUser(db, auth);
  var game = await db.get(gameId);
  if (game.ready) {
    // Penalize the user for leaving the game if it's in progress.
    if (user._id.equals(game.user1)) {
      game.score2 += LEAVE_PENALTY;
    } else if (user._id.equals(game.user2)) {
      game.score1 += LEAVE_PENALTY;
    } else {
      throw 'user is not a member of game, cannot leave game';
    }
  }
  abandonGame(game);
  await db.update(game._id, game);
});
