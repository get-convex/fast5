import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useConvex } from '../convex/_generated';

const Home: NextPage = () => {
  const [username, setUsername] = useState('');
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const convex = useConvex();
  const handleTextChange = (f: any) => {
    return (e: any) => {
      setError('');
      e.preventDefault();
      f(e.target.value);
    };
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validateAndGo = async () => {
      // TODO -- need better support for one-offs from react-convex land.
      convex
        .query('validateIds')
        .watch(username, game)
        .onUpdate((ok) => {
          if (!ok) {
            setError(
              'Invalid username and/or game id. 5+ characters of only letters and number'
            );
          } else {
            router.push(`${username}/${game}`);
          }
        });
    };
    validateAndGo();
  };

  return (
    <div>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-0">
        <div className="justify-center bg-slate-900 text-yellow-600 p-2 flex">
          <div className="">Fast5</div>
        </div>
        <form>
          <div className="flex flex-col w-80 mx-auto my-5 items-center">
            <div className="flex my-2">Join or create a game!</div>
            <div className="text-red-500 text-sm">{error ?? ''}</div>
            <div className="flex my-2">
              <input
                placeholder="Username"
                className="p-1 w-50 bg-slate-100 border-2 mx-3"
                value={username}
                onChange={handleTextChange(setUsername)}
              />
            </div>
            <div className="flex my-2">
              <input
                placeholder="Room ID"
                className="p-1 w-50 bg-slate-100 border-2 mx-3"
                value={game}
                onChange={handleTextChange(setGame)}
              />
            </div>
            <div className="flex my-2">
              <input
                className="rounded bg-orange-400 shadow p-3"
                type="button"
                onClick={handleSubmit}
                value="Create/Join Game"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Home;
