import { Id, dbWriter, eq, field } from "@convex-dev/server";

export default async function joinGame(
    user: string,
    gameName: string): Promise<Id | null> {
    
    var existing = await dbWriter
        .table("games")
        .filter(eq(field("name"), gameName))
        .first();
    
    if (existing === null) {
        // We're creating the game!
        const game = {name: gameName, ready: false, user1: user, score1: 0, score2: 0, currentRound: -1, rounds: []};
        var id = (await dbWriter.insert("games", game))._id;
    } else {
        if (existing.user1 === user || existing.user2 === user) {
            return existing._id; // They're already in.
        }
        if (existing.user2 !== undefined) {
            return null; // Already two players in the game!
        }
        existing.user2 = user;
        existing.ready = true;
        await dbWriter.replace(existing._id, existing);
        var id = existing._id as Id;
    }
    // We joined the game!
    console.log(`id is ${id}`);
    return id;
}