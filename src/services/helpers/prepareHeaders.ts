import { RootState } from "@/store";

export const prepareHeaders = (
  headers: Headers,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { getState }: { getState: any },
) => {
  const state = getState() as RootState;
  const accessToken = state.global.access_token;
  headers.set("Authorization", "Bearer " + accessToken);
};
