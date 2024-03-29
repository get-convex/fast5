import { Auth0Provider } from '@auth0/auth0-react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth0 } from 'convex/react-auth0';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import App from '../components/App/App';
import '../dist/site.css';
import '../styles/global.scss';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
        authorizationParams={{
          redirect_uri:
            typeof window !== 'undefined' ? window.location.origin : '',
        }}
        // allows auth0 to cache the authentication state locally
        cacheLocation="localstorage"
      >
        <ConvexProviderWithAuth0 client={convex}>
          <ConvexProvider client={convex}>
            <RecoilRoot>
              <App>
                <Component {...pageProps} />
              </App>
            </RecoilRoot>
          </ConvexProvider>
        </ConvexProviderWithAuth0>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
