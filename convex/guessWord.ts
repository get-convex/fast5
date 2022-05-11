import { DatabaseWriter, mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { WORDS, ALL_WORDS } from '../lib/game/constants';
import { determineGameWinner, getUser, recordGameStats } from './common';
import queryRound, { computeRoundState } from './queryRound';

export default mutation(
  async ({ db, auth }, gameId: Id, word: string): Promise<boolean> => {
    const user = await getUser(db, auth);
    const lword = word.toLocaleLowerCase().trim();
    console.log('guess is ' + lword);
    const matchesWord = (w: any) => {
      return w === lword;
    };
    if (ALL_WORDS.findIndex(matchesWord) === -1) {
      // Not a valid word.
      return false;
    }

    var game = await db.get(gameId);
    if (game.currentRound < 0) {
      return true;
    }
    let roundId = game.rounds[game.currentRound];
    var round = await db.get(roundId.id());

    if (typeof round.winner === 'number') {
      return true; // Round is over.
    }

    // Which user is this?
    if (user._id.equals(game.user1)) {
      var incScore = () => {
        // Get the computed round information.
        game.score1 += computedRound?.user1.scores.reduce((a, n) => a + n, 0);
      };
      var incOtherScore = () => {
        game.score2 += computedRound?.user2.scores.reduce((a, n) => a + n, 0);
      };
      var userRound = round.user1;
      var otherUserRound = round.user2;
      var userId = 1;
      var otherId = 2;
    } else if (user._id.equals(game.user2)) {
      var incScore = () => {
        game.score2 += computedRound?.user2.scores.reduce((a, n) => a + n, 0);
      };
      var incOtherScore = () => {
        game.score1 += computedRound?.user1.scores.reduce((a, n) => a + n, 0);
      };
      var userRound = round.user2;
      var otherUserRound = round.user1;
      var userId = 2;
      var otherId = 1;
    } else {
      throw 'invalid user';
    }

    // Must be room for another guess, if the winner is not decided.
    userRound.guesses.push(lword);
    const computedRound = computeRoundState(user, game, round);

    if (lword === round.word) {
      // Guessed correctly!
      round.winner = userId;
      incScore();
      await checkForFinishedGame(db, game);
      await db.replace(game._id, game);
    } else if (userRound.guesses.length === 6) {
      // They're out of guesses
      round.winner = otherId;
      round.overflow = true;
      incOtherScore();
      await checkForFinishedGame(db, game);
      await db.replace(game._id, game);
    }

    await db.replace(round._id, round);
    return true;
  }
);

async function checkForFinishedGame(db: DatabaseWriter, game: any) {
  // Check for end of game.
  if (game.rounds.length === 5) {
    determineGameWinner(game);
    await recordGameStats(db, game);
  }
}
