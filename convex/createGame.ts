import { DatabaseWriter, mutation } from './_generated/server';
import { defaultGame, randomGameName } from './common';
import { Doc } from './_generated/dataModel';
import { mutationWithUser } from './lib/withUser';

export default mutationWithUser(async ({ db, user }) => {
  return createGameHelper(db, user, false);
});

export const createGameHelper = async (
  db: DatabaseWriter,
  user: Doc<'users'>,
  pub: boolean
) => {
  while (true) {
    var gameName = randomGameName();

    var existing = await db
      .query('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .unique();

    if (existing === null) {
      // We're creating the game!
      break;
    }
  }
  const game = defaultGame(gameName, user, pub);
  await db.insert('games', game);
  return gameName;
};
