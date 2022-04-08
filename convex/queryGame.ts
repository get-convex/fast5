import { Id, query } from '@convex-dev/server';
import { WORDS } from '../lib/game/constants';
import { BackendGame } from '../lib/game/proto';
import { getUser } from './common';

export default query(async ({ db, auth }, gameId: Id): Promise<BackendGame> => {
  const user = await getUser(db, auth);
  console.log(`query game on ${gameId.toString()}`);
  const game = await db.get(gameId);
  console.log('next');
  const user1 = await db.get(game.user1);
  console.log('and next');
  const user2 = game.user2 !== undefined ? await db.get(game.user2) : null;
  console.log('done');
  console.log(`game = ${JSON.stringify(game)}, user = ${JSON.stringify(user)}`);

  var state = {
    round: game.rounds.length,
    user1: {
      displayName: user1.displayName,
      score: game.score1,
      isYou: user._id.equals(game.user1),
    },
    user2: {
      displayName: user2 === null ? '' : user2.displayName,
      score: game.score2,
      isYou: user._id.equals(game.user2),
    },
    ready: user2 !== null,
    inRound: game.currentRound !== -1,
    winner: 0,
    over: false,
  };
  if (state.round == 5) {
    const finalId = game.rounds[4];
    const round = await db.get(finalId.id());
    if (typeof round.winner === 'number') {
      // Game is over.
      state.over = true;
      if (state.user1.score > state.user2.score) {
        state.winner = 1;
      } else if (state.user2.score > state.user1.score) {
        state.winner = 2;
      }
    }
  }
  return state;
});
