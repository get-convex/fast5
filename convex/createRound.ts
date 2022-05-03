import { mutation } from 'convex-dev/server';
import { WORDS } from '../lib/game/constants';
import { dlog } from '../lib/game/util';
import { Id } from 'convex-dev/values';

export default mutation(async ({ db }, gameId: Id, next: number) => {
  var game = await db.get(gameId);
  if (game.user2 == undefined) {
    // Still waiting on the other party.
    return;
  }
  if (game.rounds.length === 5) {
    // Game is over.
    return;
  }
  if (game.rounds.length !== next) {
    // Lost the race to create the round.
    return;
  }
  if (game.rounds.length > 0) {
    const lastId = game.rounds[game.rounds.length - 1];
    const lastRound = await db.get(lastId.id());
    if (typeof lastRound.winner !== 'number') {
      // Last round, no one won yet!
      return;
    }
  }
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const round = {
    word: word,
    user1: {
      guesses: [],
      spying: false,
    },
    user2: {
      guesses: [],
      spying: false,
    },
    winner: null,
    overflow: false,
  };
  const id = await db.insert('rounds', round);
  game.rounds.push(id);
  game.currentRound = game.rounds.length - 1;
  await db.update(game._id, game);
});
