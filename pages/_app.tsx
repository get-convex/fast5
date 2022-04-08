import { Auth0Provider } from '@auth0/auth0-react';
import { ConvexProvider, ConvexReactClient } from '@convex-dev/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import App from '../components/App/App';
import convexConfig from '../convex.json';
import '../dist/site.css';
import '../styles/global.scss';

const convex = new ConvexReactClient(convexConfig.origin);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      // domain and clientId come from your Auth0 app dashboard
      domain="dev-cmcijui1.us.auth0.com"
      clientId="8LDbMeli4aE9BcJ2djy6vrxTn4SYdJ1P"
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
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
  );
}

export default MyApp;
