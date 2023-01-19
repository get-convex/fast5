import { query } from './_generated/server';
import { Id } from './_generated/dataModel';
import { BackendGame } from '../lib/game/proto';
import { withUser } from './common';

export default query(
  withUser(async ({ db, user }, gameId: Id<'games'>): Promise<BackendGame> => {
    const game = await db.get(gameId);
    if (!game) throw Error('Game not found');
    const user1 = (await db.get(game.user1))!;
    const user2 = game.user2 ? await db.get(game.user2) : null;

    var state = {
      round: game.rounds.length,
      public: game.public ?? false,
      abandoned: game.abandoned ?? false,
      user1: {
        displayName: user1.displayName,
        photoUrl: user1.photoUrl,
        score: game.score1,
        isYou: user._id.equals(game.user1),
        stats: {
          wins: user1?.wins ?? 0,
          losses: user1?.losses ?? 0,
          ties: user1?.ties ?? 0,
        },
      },
      user2: {
        displayName: user2 === null ? '' : user2.displayName,
        photoUrl: user2 === null ? '' : user2.photoUrl,
        score: game.score2,
        isYou: user._id.equals(game.user2),
        stats: {
          wins: user2?.wins ?? 0,
          losses: user2?.losses ?? 0,
          ties: user2?.ties ?? 0,
        },
      },
      ready: game.ready,
      inRound: game.currentRound !== -1,
      winner: game.winner,
      over: game.winner > 0,
    };
    return state;
  })
);
