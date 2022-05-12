![Fast5](https://fast5.live/ff_full.png)

Fast5 is a multiplayer word racing game built on the powerful global state management platform
Convex (https://convex.dev). The frontend uses Next.js and is hosted on Vercel.

The project was created by the Convex team as an example for how to build something like a game using Convex.

You can find (and play!) the production version of fast5 at:

https://fast5.live/

# Running your own version of the Fast5 frontend

```
yarn install
yarn run dev
```

# Building on Fast5

Forking Fast5 requires both updates to the UI, and potentially changes to the Convex functions
which constitute the backend runtime of the game.

The `convex.json` in this repository refers to the production Convex deployment and the Auth0 account
maintained by the Convex team, and admin keys / secrets are (for hopefully clear reasons)
not present in this repository.

To run your own, modified version of Fast5, you'll need to create your own
Convex deployment and push your modified functions to it. If you don't
have a beta key yet for Convex, sign up at https://convex.dev!

All the docs that describe how to build things like Fast5 can be found at https://docs.convex.dev/.
Our blog, which has tips and tricks for using Convex, is at https://blog.convex.dev/.

# Community

If you want to ask questions about Fast5, or the Convex global state mangement platform in general, please join our slack:

https://join.slack.com/t/convexcommunity/shared_invite/zt-zvqpuz43-zcf9soDUQt5rkQ_7BNLqYA

# FAQ

## Is this game like Wordle?

Yes! Except you're racing in 5 rounds against an opponent.

## Why is it called "Fast5"?

Because the secret word has 5 letters, and there are 5 rounds, and... you better
be _fast_ to win!
