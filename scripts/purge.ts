import { ConvexHttpClient } from 'convex/browser';
import clientConfig from "../convex/_generated/clientConfig";

const convex = new ConvexHttpClient(clientConfig);

async function go() {
  await convex.mutation('purgeAbandoned')();
}

go();
