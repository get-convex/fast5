import { useAuth0 } from '@auth0/auth0-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import StartGame from '../components/StartGame/StartGame';
import { useConvex, useMutation } from '../convex/_generated';

const Home: NextPage = () => {
  const convex = useConvex();
  let { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const storeUser = useMutation('storeUser');

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
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, storeUser]);

  return (
    <div>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StartGame />
    </div>
  );
};

export default Home;
