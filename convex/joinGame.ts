import { Id, mutation } from '@convex-dev/server';
import { getUser } from './common';
import { validateIdsInternal } from './validateIds';

export default mutation(
  async ({ db, auth }, gameName: string): Promise<Id | null> => {
    const user = await getUser(db, auth);
    var gameName = gameName.toLocaleLowerCase().trim();
    if (!validateIdsInternal(gameName)) {
      return null; // Refuse to create invalid game or user
    }

    var existing = await db
      .table('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (existing === null) {
      // We're creating the game!
      const game = {
        name: gameName,
        ready: false,
        user1: user._id,
        score1: 0,
        score2: 0,
        currentRound: -1,
        rounds: [],
      };
      var id = await db.insert('games', game);
    } else {
      if (user._id.equals(existing.user1) || user._id.equals(existing.user2)) {
        return existing._id; // They're already in.
      }
      if (existing.user2 !== undefined) {
        return null; // Already two players in the game!
      }
      existing.user2 = user._id;
      existing.ready = true;
      await db.replace(existing._id, existing);
      var id = existing._id as Id;
    }
    // We joined the game!
    console.log(`id is ${id}`);
    return id;
  }
);
