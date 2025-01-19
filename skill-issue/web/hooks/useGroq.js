import { useCallback } from "react";
import { useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";

/**
 * Custom hook for making requests to the askGroq global action
 * @param {string} initialPrompt - Initial prompt to use
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: Error | null,
 *   execute: (prompt: string) => Promise<void>
 * }}
 */
export function useGroq(initialPrompt = "") {
  const [{ data, fetching: loading, error }, runAskGroq] = useGlobalAction(api.askGroq);

  const execute = useCallback(
    async (prompt) => {
      await runAskGroq({ prompt });
    },
    [runAskGroq]
  );

  return {
    data: data?.result ?? null,
    loading,
    error,
    execute,
  };
}