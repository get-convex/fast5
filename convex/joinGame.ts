import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';
import { withUser } from './common';

export default mutation(
  withUser(
    async ({ db, user }, gameName: string): Promise<Id<'games'> | null> => {
      var gameName = gameName.toLocaleLowerCase().trim();

      var existing = await db
        .query('games')
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
      db.replace(existing._id, existing);
      var id = existing._id;

      // We joined the game!
      console.log(`id is ${id}`);
      return id;
    }
  )
);
