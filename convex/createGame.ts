import { DatabaseWriter } from './_generated/server';
import { defaultGame, randomGameName, secureMutation } from './common';
import { Document } from './_generated/dataModel';
import { z } from 'zod';

export default secureMutation(
  [],
  async ({ db, user }) => {
    return createGameHelper(db, user, false);
  },
  z.nullable(z.string())
);

export const createGameHelper = async (
  db: DatabaseWriter,
  user: Document<'users'>,
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
