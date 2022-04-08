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
