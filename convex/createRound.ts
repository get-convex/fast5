import { mutation } from './_generated/server';
import { WORDS } from '../lib/game/constants';
import { Id } from './_generated/dataModel';
import { dlog } from '../lib/game/util';

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
  const id = db.insert('rounds', round);
  game.rounds.push(id);
  game.currentRound = game.rounds.length - 1;
  db.patch(game._id, game);
});
