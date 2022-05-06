import { User } from '../lib/game/proto';

export const getUser = async (db: any, auth: any): Promise<User> => {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error(
      'Unauthenticated call to function requiring authentication'
    );
  }
  const user = await db
    .table('users')
    .filter((q: any) =>
      q.eq(q.field('tokenIdentifier'), identity.tokenIdentifier)
    )
    .unique();
  return user;
};

const LETTERS = [
  'b',
  'c',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'm',
  'n',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'w',
  'x',
  'z',
  '2',
  '5',
  '6',
  '9',
];
export const randomGameName = (): string => {
  var acc = [];
  for (var i = 0; i < 6; i++) {
    acc.push(LETTERS[Math.floor(Math.random() * 24)]);
  }
  console.log(JSON.stringify(acc));
  return acc.join('');
};

export function abandonGame(game: any) {
  game.abandoned = true;
  if (game.ready) {
    determineGameWinner(game);
  }
}

export function determineGameWinner(game: any) {
  if (game.score1 > game.score2) {
    game.winner = 1;
  } else if (game.score2 > game.score1) {
    game.winner = 2;
  } else {
    game.winner = 3;
  }
}

export function defaultGame(
  gameName: string,
  creator: User,
  pub: boolean
): any {
  const game = {
    name: gameName,
    public: pub,
    ready: false,
    abandoned: false,
    user1: creator._id,
    user1Ping: Math.floor(Date.now() / 1000),
    score1: 0,
    score2: 0,
    currentRound: -1,
    rounds: [],
    winner: 0,
  };
  return game;
}
