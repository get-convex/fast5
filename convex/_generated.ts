/* eslint-disable */
// Generated by @convex-dev/cli@0.0.56
// based on the contents of this directory.
// To regenerate, run `convex codegen`.
import type createRound from "./createRound";
import type guessWord from "./guessWord";
import type joinGame from "./joinGame";
import type queryGame from "./queryGame";
import type queryRound from "./queryRound";
import type steal from "./steal";

type ConvexAPI = {
  queries: {
    queryGame: typeof queryGame;
    queryRound: typeof queryRound;
  };
  mutations: {
    createRound: typeof createRound;
    guessWord: typeof guessWord;
    joinGame: typeof joinGame;
    steal: typeof steal;
  };
};

import {
  makeUseQuery,
  makeUseMutation,
  makeUseConvex,
} from "@convex-dev/react";

export const useQuery = makeUseQuery<ConvexAPI>();
export const useMutation = makeUseMutation<ConvexAPI>();
export const useConvex = makeUseConvex<ConvexAPI>();
