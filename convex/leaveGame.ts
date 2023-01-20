import { Id } from './_generated/dataModel';
import { abandonGame, recordGameStats } from './common';
import { mutationWithUser } from './lib/withUser';

const LEAVE_PENALTY = 100;

export default mutationWithUser(async ({ db, user }, gameId: Id<'games'>) => {
  const game = await db.get(gameId);
  if (!game) throw Error('Game not found');
  if (game.winner > 0) {
    // Game already has an outcome.
    return;
  }
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
  await recordGameStats(db, game);
  await db.patch(game._id, game);
});
