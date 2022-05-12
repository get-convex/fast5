![Fast5](https://fast5.live/ff_full.png)

Fast5 is a multiplayer word racing game built on Convex (https://convex.dev). It uses Next.js and is hosted on Vercel.

The project was created by the Convex team as an example for how to build something like a game using Convex.

You can find the production version of fast5 running at:

https://fast5.live/

# Running your own version of the Fast5 frontend

```
yarn install
yarn run dev
```

# Making modifications to the whole system

The `convex.json` in this repository refers to the production Convex instance and the Auth0 account
maintained by the Convex team, and admin keys / secrets are (for hopefully obvious reasons)
not present in this repository.

To run your own, modified instance of Fast5, you'll need to create your own
Convex instance. If you don't have a beta key yet for Convex, sign up at https://convex.dev!

All the docs that describe how to build things Fast5 this can be found at https://docs.convex.dev/

If you want to ask questions about Fast5, or about any other Convex thing, please join our slack:

https://join.slack.com/t/convexcommunity/shared_invite/zt-zvqpuz43-zcf9soDUQt5rkQ_7BNLqYA

# FAQ

## Is this like Wordle?

Yes! Except you're racing in 5 rounds against an opponent.

## Why is it called "Fast5"?

Because the word has 5 letters, and there are 5 rounds, and... you better
be _fast_ to win!
