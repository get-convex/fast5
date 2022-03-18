
import { Id, db, eq, field } from "@convex-dev/server";
import { FULL_SCORES, STOLEN_SCORES } from "../lib/game/constants"

export default async function queryRound(gameId: Id, user: string) {
    console.log("query round...");
    const game = await db.get(gameId);
    if (game.currentRound === -1) {
        return null;
    }
    console.log("continuing...");
    const roundId = game.rounds[game.currentRound];
    const round = await db.get(roundId.id());

    const over = typeof round.winner === "number";
    const scores1 = round.user1.stolen ? STOLEN_SCORES : FULL_SCORES;
    const guesses1: string[][] = buildLetters(round, round.user1, round.user2.stolen, game.user1 === user, over);

    const scores2 = round.user2.stolen ? STOLEN_SCORES : FULL_SCORES;
    const guesses2: string[][] = buildLetters(round, round.user2, round.user1.stolen, game.user2 === user, over);

    return {
        word: round.winner ? round.word : null,
        user1: {
            guesses: guesses1,
            scores: scores1,
            stolen: round.user1.stolen,
        },
        user2: {
            guesses: guesses2,
            scores: scores2,
            stolen: round.user2.stolen,
        },
        winner: round.winner ?? null,
        overflow: round.overflow,
    }
}

function buildLetters(round: any, user: any, stolen: boolean, isMe: boolean, done: boolean): string[][] {
    const word = round.word;
    const canSee = isMe || stolen || done;
    var boardSide = [];
    for (const guess of user.guesses) {
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
                result[i] = `2${result[i][1]}`;
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
                result[i] = `1${result[i][1]}`;
                unmatchedLetters.splice(idx, 1);
            }
        }
        boardSide.push(result);
    }
    return boardSide;
}