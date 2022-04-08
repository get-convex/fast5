```
      ::::::::::  :::     :::::::::::::::::::::::::::::
     :+:       :+: :+:  :+:    :+:   :+:    :+:    :+:
    +:+      +:+   +:+ +:+          +:+    +:+
   :#::+::#+#++:++#++:+#++:++#++   +#+    +#++:++#+
  +#+     +#+     +#+       +#+   +#+           +#+
 #+#     #+#     #+##+#    #+#   #+#    #+#    #+#
###     ###     ### ########    ###     ########
```

Fast5 is a multiplayer word racing game built with Convex (https://convex.dev) and Next.js.

The project was created by the Convex team as an example for how to build something like a game using Convex.

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

All the docs that describe how to build things like this can be found at https://docs.convex.dev/
