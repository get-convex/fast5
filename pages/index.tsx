import { useAuth0 } from '@auth0/auth0-react';
import { Id } from '@convex-dev/server';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import Modal from '../components/Modal/Modal';
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

  const handleCreateGame = () => {
    const go = async () => {
      const gameName = await createGame();
      router.push(`game/${gameName}`);
    };
    go();
  };

  const handleJoinGame = () => {
    const go = async () => {
      router.push(`join`);
    };
    go();
  };

  const handleRandom = () => {
    const go = async () => {
      const gameName = await createOrJoinRandom();
      router.push(`game/${gameName}`);
    };
    go();
  };

  if (userId !== null) {
    var startGame = (
      <Modal>
        <div className="text-red-500 text-sm">{error ?? ''}</div>
        <div className="flex my-2">
          <Button onClick={handleCreateGame}>
            Create a Game to Play a Friend
          </Button>
        </div>
        <div className="flex my-2">
          <Button onClick={handleJoinGame}>Join a Friend&rsquo;s Game</Button>
        </div>
        <div className="flex my-2">
          <Button onClick={handleRandom}>
            Play a Friendly Internet Stranger
          </Button>
        </div>
      </Modal>
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
