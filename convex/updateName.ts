import { z } from 'zod';
import { secureMutation } from './common';

export default secureMutation([z.string()], async ({ db, user }, name) => {
  await db.patch(user._id, { displayName: name });
});
