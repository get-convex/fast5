import type { AppProps } from 'next/app';
import '../dist/site.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { ConvexProvider, ReactClient } from '@convex-dev/react';
import convexConfig from '../convex.json';

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
