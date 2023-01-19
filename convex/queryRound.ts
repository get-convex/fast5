import { query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { withUser } from './common';

export default query(
  withUser(async ({ db, user }, gameId: Id<'games'>) => {
    console.log('query round...');
    const game = await db.get(gameId);
    if (!game) throw Error('Game not found');
    if (game.currentRound === -1) {
      return null;
    }
    console.log('continuing...');
    const roundId = game.rounds[game.currentRound];
    const round = await db.get(roundId);
    return computeRoundState(user, game, round);
  })
);

export function computeRoundState(user: any, game: any, round: any) {
  const over = typeof round.winner === 'number';

  var { guesses, scores } = buildGuessState(
    round,
    round.user1,
    round.user2.spying,
    user._id.equals(game.user1),
    over
  );
  penalizeScores(round.user1.spying, scores);
  const guesses1 = guesses;
  const scores1 = scores;

  var { guesses, scores } = buildGuessState(
    round,
    round.user2,
    round.user1.spying,
    user._id.equals(game.user2),
    over
  );
  penalizeScores(round.user2.spying, scores);

  const guesses2 = guesses;
  const scores2 = scores;

  return {
    word: round.winner ? round.word : null,
    user1: {
      guesses: guesses1,
      scores: scores1,
      spying: round.user1.spying,
    },
    user2: {
      guesses: guesses2,
      scores: scores2,
      spying: round.user2.spying,
    },
    winner: round.winner ?? null,
    overflow: round.overflow,
  };
}

const penalizeScores = (spying: boolean, scores: number[]) => {
  if (spying) {
    for (var i in scores) {
      scores[i] = scores[i] / 2;
    }
  }
};

interface GuessState {
  guesses: string[][];
  scores: number[];
}

function buildGuessState(
  round: any,
  user: any,
  spying: boolean,
  isMe: boolean,
  done: boolean
): GuessState {
  const word = round.word;
  const canSee = isMe || spying || done;
  var yellows: Set<string> = new Set();
  var greens: Set<string> = new Set();
  var boardSide = [];
  var scores = [];
  for (const guess of user.guesses) {
    var rowScore = 0;
    if (canSee) {
      var result = [
        `0${guess[0].toLocaleUpperCase()}`,
        `0${guess[1].toLocaleUpperCase()}`,
        `0${guess[2].toLocaleUpperCase()}`,
        `0${guess[3].toLocaleUpperCase()}`,
        `0${guess[4].toLocaleUpperCase()}`,
      ];
    } else {
      var result = ['0?', '0?', '0?', '0?', '0?'];
    }
    var unmatchedLetters = [];
    var unmatchedIndexes = [];
    // TODO -- unmatched indexes -- for yellow pass
    // Green pass:
    // Green if it's in the right place.
    for (var i = 0; i < 5; i++) {
      if (guess[i] === word[i]) {
        if (!greens.has(guess[i])) {
          greens.add(guess[i]);
          rowScore += 4;
          result[i] = `4${result[i][1]}`;
        } else {
          result[i] = `2${result[i][1]}`;
        }
      } else {
        unmatchedLetters.push(word[i]);
        unmatchedIndexes.push(i);
      }
    }

    // Yellow pass:
    // Yellow if it's in the non-green but present set
    for (const i of unmatchedIndexes) {
      const idx = unmatchedLetters.findIndex((v) => v === guess[i]);
      if (idx !== -1) {
        if (!yellows.has(guess[i])) {
          yellows.add(guess[i]);
          rowScore += 2;
          result[i] = `3${result[i][1]}`;
        } else {
          result[i] = `1${result[i][1]}`;
        }
        unmatchedLetters.splice(idx, 1);
      }
    }
    boardSide.push(result);
    scores.push(rowScore);
  }
  return {
    guesses: boardSide,
    scores: scores,
  };
}
