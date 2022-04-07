import { ConvexProvider, ReactClient } from '@convex-dev/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import App from '../components/App/App';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import convexConfig from '../convex.json';
import '../dist/site.css';
import '../styles/global.scss';

const convex = new ReactClient(convexConfig.origin);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <RecoilRoot>
        <App>
          <Component {...pageProps} />
        </App>
      </RecoilRoot>
    </ConvexProvider>
  );
}

export default MyApp;
