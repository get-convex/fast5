import { Auth0Provider } from '@auth0/auth0-react';
import { ConvexProvider, ConvexReactClient } from 'convex-dev/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import App from '../components/App/App';
import convexConfig from '../convex.json';
import '../dist/site.css';
import '../styles/global.scss';

const convex = new ConvexReactClient(convexConfig.origin);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Auth0Provider
        // domain and clientId come from your Auth0 app dashboard
        domain="fast5game.us.auth0.com"
        clientId="6KEk73Smc7EYgNTgHQCflY94ZoFx3Zz8"
        redirectUri={
          typeof window !== 'undefined' ? window.location.origin : ''
        }
        // allows auth0 to cache the authentication state locally
        cacheLocation="localstorage"
      >
        <ConvexProvider client={convex}>
          <RecoilRoot>
            <App>
              <Component {...pageProps} />
            </App>
          </RecoilRoot>
        </ConvexProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
