import { DatabaseWriter, QueryCtx } from './_generated/server';
import { Doc } from './_generated/dataModel';

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

export async function recordGameStats(db: DatabaseWriter, game: Doc<'games'>) {
  if (!game.ready) {
    // Game was never started. No winning.
    return;
  }
  if (game.winner < 1) {
    throw "Game doesn't seem to be over";
  }
  const user1 = (await db.get(game.user1))!;
  const user2 = (await db.get(game.user2!))!;
  if (game.winner === 1) {
    user1.wins = (user1.wins ?? 0) + 1;
    user2.losses = (user2.losses ?? 0) + 1;
  } else if (game.winner === 2) {
    user2.wins = (user2.wins ?? 0) + 1;
    user1.losses = (user1.losses ?? 0) + 1;
  } else if (game.winner === 3) {
    user1.ties = (user1.ties ?? 0) + 1;
    user2.ties = (user2.ties ?? 0) + 1;
  } else {
    throw 'unknown winner code';
  }
  db.replace(user1._id, user1);
  db.replace(user2._id, user2);
}

export function defaultGame(
  gameName: string,
  creator: Doc<'users'>,
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

export const TIMEOUT_THRESHOLD = 60; // Gone for one minute = abandoned.
