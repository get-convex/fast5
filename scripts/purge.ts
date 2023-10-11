import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function go() {
  await convex.mutation(api.purgeAbandoned.default);
}

go();
