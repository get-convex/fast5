/* eslint-disable */
/**
 * Generated API.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@0.6.0.
 * To regenerate, run `npx convex codegen`.
 * @module
 */

import type { ApiFromModules } from "convex/api";
import type * as common from "../common";
import type * as createGame from "../createGame";
import type * as createOrJoinRandom from "../createOrJoinRandom";
import type * as createRound from "../createRound";
import type * as guessWord from "../guessWord";
import type * as joinGame from "../joinGame";
import type * as leaveGame from "../leaveGame";
import type * as ping from "../ping";
import type * as purgeAbandoned from "../purgeAbandoned";
import type * as queryGame from "../queryGame";
import type * as queryRound from "../queryRound";
import type * as spy from "../spy";
import type * as storeUser from "../storeUser";
import type * as updateName from "../updateName";
import type * as validateGame from "../validateGame";

/**
 * A type describing your app's public Convex API.
 *
 * This `API` type includes information about the arguments and return
 * types of your app's query and mutation functions.
 *
 * This type should be used with type-parameterized classes like
 * `ConvexReactClient` to create app-specific types.
 */
export type API = ApiFromModules<{
  common: typeof common;
  createGame: typeof createGame;
  createOrJoinRandom: typeof createOrJoinRandom;
  createRound: typeof createRound;
  guessWord: typeof guessWord;
  joinGame: typeof joinGame;
  leaveGame: typeof leaveGame;
  ping: typeof ping;
  purgeAbandoned: typeof purgeAbandoned;
  queryGame: typeof queryGame;
  queryRound: typeof queryRound;
  spy: typeof spy;
  storeUser: typeof storeUser;
  updateName: typeof updateName;
  validateGame: typeof validateGame;
}>;