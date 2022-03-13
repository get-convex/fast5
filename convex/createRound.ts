import { Id, dbWriter, eq, field } from "@convex-dev/server";
import { WORDS } from "../lib/types"

export default async function createRound(gameId: Id, next: number) {
    console.log("round created...");
    var game = await dbWriter.get(gameId);
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
    console.log("making round!");
    if (game.rounds.length > 0) {
        const lastId = game.rounds[game.rounds.length - 1];
        const lastRound = await dbWriter.get(lastId.id());
        if (typeof lastRound.winner !== 'number') {
            console.log("Tried to advance rounds, but no winner yet");
            // Last round, no one won yet!
            return;
        }
    }
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const round = {
        word: word,
        user1: {
            guesses: [],
            stolen: false,
        },
        user2: {
            guesses: [],
            stolen: false,
        },
        winner: null,
        overflow: false,
    };
    const r = await dbWriter.insert("rounds", round);
    game.rounds.push(r._id.strongRef());
    game.currentRound = game.rounds.length - 1;
    await dbWriter.update(game._id, game);
}