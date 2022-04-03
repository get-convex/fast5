import { Id, db, eq, field } from '@convex-dev/server';
import { WORDS } from '../lib/game/constants';

export default async function queryGame(gameId: Id) {
  console.log(`query game on ${gameId.toString()}`);
  const game = await db.get(gameId);

  var state = {
    round: game.rounds.length,
    user1: {
      displayName: game.user1,
      score: game.score1,
    },
    user2: {
      displayName: game.user2 == undefined ? '' : game.user2,
      score: game.score2,
    },
    ready: game.user2 != undefined ? true : false,
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
}
