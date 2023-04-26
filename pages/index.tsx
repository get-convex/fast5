import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Splash from '../components/Splash/Splash';
import StartGame from '../components/StartGame/StartGame';
import { useMutation } from '../convex/_generated/react';
import { useConvexAuth } from 'convex/react';

const Home: NextPage = () => {
  let { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation('storeUser');

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      storeUser();
    }
  }, [isAuthenticated, isLoading, storeUser]);

  return (
    <div>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isAuthenticated ? <StartGame /> : <Splash />}
    </div>
  );
};

export default Home;
