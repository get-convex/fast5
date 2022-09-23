import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';
import { WORDS } from '../lib/game/constants';
import { getUser } from './common';

export default mutation(async ({ db, auth }, gameId: Id) => {
  const user = await getUser(db, auth);
  var game = await db.get(gameId);
  if (game.currentRound < 0) {
    return;
  }
  let roundId = game.rounds[game.currentRound];
  var round = await db.get(roundId.id());
  if (typeof round.winner === 'number') {
    return; // Round is over.
  }

  // Which user is this?
  if (user._id.equals(game.user1)) {
    var userRound = round.user1;
  } else if (user._id.equals(game.user2)) {
    var userRound = round.user2;
  }

  // Must be room for another guess, if the winner is not decided.
  userRound.spying = true;
  db.replace(round._id, round);
});
