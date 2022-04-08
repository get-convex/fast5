import { useAuth0 } from '@auth0/auth0-react';
import { Id } from '@convex-dev/server';
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
  const storeUser = useMutation('storeUser');
  const createGame = useMutation('createGame');
  const createOrJoinRandom = useMutation('createOrJoinRandom');

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getIdTokenClaims().then(async (claims) => {
        // Get the raw ID token from the claims.
        let token = claims!.__raw;
        // Pass it to the Convex client.
        convex.setAuth(token);
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        let id = await storeUser();
        setUserId(id);
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      setUserId(null);
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser]);

  const handleCreateGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createGame();
      router.push(`game/${gameName}`);
    };
    go();
  };
  const handleJoinGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      router.push(`join`);
    };
    go();
  };
  const handleRandom = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createOrJoinRandom();
      router.push(`game/${gameName}`);
    };
    go();
  };
  if (userId !== null) {
    var startGame = (
      <>
        <div className="flex my-2">Join or create a game!</div>
        <div className="text-red-500 text-sm">{error ?? ''}</div>
        <div className="flex my-2">
          <input
            className="rounded bg-orange-400 shadow p-3"
            type="button"
            onClick={handleCreateGame}
            value="Create a game to play a friend"
          />
        </div>
        <div className="flex my-2">
          <input
            className="rounded bg-orange-400 shadow p-3"
            type="button"
            onClick={handleJoinGame}
            value="Join a friend's game"
          />
        </div>
        <div className="flex my-2">
          <input
            className="rounded bg-orange-400 shadow p-3"
            type="button"
            onClick={handleRandom}
            value="Play a friendly Internet stranger"
          />
        </div>
      </>
    );
  } else {
    var startGame = <></>;
  }

  return (
    <div>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-0">
        <div className="flex my-2">
          <LoginLogout />
        </div>
        <form>
          <div className="flex flex-col w-80 mx-auto my-5 items-center">
            {startGame}
          </div>
        </form>
      </main>
    </div>
  );
};

export default Home;

function LoginLogout() {
  let { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();
  if (isLoading) {
    return (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Loading...
      </button>
    );
  }
  if (isAuthenticated) {
    return (
      <div>
        {/* We know that Auth0 provides the user's name, but another provider
        might not. */}
        <p>Logged in as {user!.name}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </button>
      </div>
    );
  } else {
    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={loginWithRedirect}
      >
        Log in
      </button>
    );
  }
}
