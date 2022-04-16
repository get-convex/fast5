import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import {
  FULL_SCORES,
  STOLEN_SCORES,
  WORDS,
  ALL_WORDS,
} from '../lib/game/constants';
import { getUser } from './common';

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
      var incScore = (v: number) => {
        game.score1 += v;
      };
      var incOtherScore = (v: number) => {
        game.score2 += v;
      };
      var userRound = round.user1;
      var otherUserRound = round.user2;
      var userId = 1;
      var otherId = 2;
    } else if (user._id.equals(game.user2)) {
      var incScore = (v: number) => {
        game.score2 += v;
      };
      var incOtherScore = (v: number) => {
        game.score1 += v;
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

    if (lword === round.word) {
      // Guessed correctly!
      round.winner = userId;
      incScore(
        userRound.stolen
          ? STOLEN_SCORES[userRound.guesses.length - 1]
          : FULL_SCORES[userRound.guesses.length - 1]
      );
      await db.replace(game._id, game);
    } else if (userRound.guesses.length === 6) {
      // They're out of guesses
      round.winner = otherId;
      round.overflow = true;
      incOtherScore(
        otherUserRound.stolen
          ? STOLEN_SCORES[otherUserRound.guesses.length]
          : FULL_SCORES[otherUserRound.guesses.length]
      );
      await db.replace(game._id, game);
    }
    await db.replace(round._id, round);
    return true;
  }
);
