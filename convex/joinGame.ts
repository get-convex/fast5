import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { getUser } from './common';

export default mutation(
  async ({ db, auth }, gameName: string): Promise<Id | null> => {
    const user = await getUser(db, auth);
    var gameName = gameName.toLocaleLowerCase().trim();

    var existing = await db
      .table('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (existing === null) {
      return null; // This is not the place to create games.
    }
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

    // We joined the game!
    console.log(`id is ${id}`);
    return id;
  }
);
