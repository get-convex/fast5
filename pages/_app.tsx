import { ConvexProvider, ReactClient } from '@convex-dev/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import convexConfig from '../convex.json';
import '../dist/site.css';
import '../styles/global.scss';

const convex = new ReactClient(convexConfig.origin);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ConvexProvider>
  );
}

export default MyApp;
