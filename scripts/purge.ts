import { ConvexHttpClient } from 'convex-dev/browser';
import convexConfig from '../convex.json';

const convex = new ConvexHttpClient(convexConfig.origin);

async function go() {
  await convex.mutation('purgeAbandoned')();
}

go();
