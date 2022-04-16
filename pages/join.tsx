import { useAuth0 } from '@auth0/auth0-react';
import { Id } from 'convex-dev/values';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { start } from 'repl';
import { useConvex, useMutation } from '../convex/_generated';

const Home: NextPage = () => {
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const convex = useConvex();
  let { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [userId, setUserId] = useState<Id | null>(null);
  const createGame = useMutation('createGame');

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      convex.clearAuth();
      router.push('/');
    }
  }, [isAuthenticated, isLoading, convex, router]);

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
        .watchQuery('validateGame', game)
        .onUpdate((err) => {
          if (typeof err === 'string') {
            setError(`Error joining game: ${err}`);
          } else {
            router.push(`game/${game.toLocaleLowerCase().trim()}`);
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
            <div className="flex my-2">Join your friend&apos;s game</div>
            <div className="text-red-500 text-sm">{error ?? ''}</div>
            <div className="flex my-2">
              <input
                placeholder="Game Code"
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
                value="Join Game"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Home;
