import { Id, dbWriter, eq, field } from "@convex-dev/server";
import { FULL_SCORES, STOLEN_SCORES, WORDS } from "../lib/types"

export default async function steal(gameId: Id, user: string) {
    var game = await dbWriter.get(gameId);
    if (game.currentRound < 0) {
        return;
    }
    let roundId = game.rounds[game.currentRound];
    var round = await dbWriter.get(roundId.id());

    // Which user is this?
    if (game.user1 === user) {
        var userRound = round.user1;
    } else if (game.user2 === user) {
        var userRound = round.user2;
    }

    // Must be room for another guess, if the winner is not decided.
    userRound.stolen = true;
    await dbWriter.replace(round._id, round);
}