import { query } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { WORDS } from '../lib/game/constants';
import { BackendGame } from '../lib/game/proto';
import { getUser } from './common';

export default query(async ({ db, auth }, gameId: Id): Promise<BackendGame> => {
  const user = await getUser(db, auth);
  const game = await db.get(gameId);
  const user1 = await db.get(game.user1);
  const user2 = game.user2 !== undefined ? await db.get(game.user2) : null;

  var state = {
    round: game.rounds.length,
    public: game.public ?? false,
    user1: {
      displayName: user1.displayName,
      photoUrl: user1.photoUrl,
      score: game.score1,
      isYou: user._id.equals(game.user1),
    },
    user2: {
      displayName: user2 === null ? '' : user2.displayName,
      photoUrl: user2 === null ? '' : user2.photoUrl,
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
