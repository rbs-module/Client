/* eslint-disable @typescript-eslint/no-explicit-any */
import { accountsApi } from "@/services/accounts";
import { getSocket } from "@/socket/socket";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import type { AccountType } from "@/zod-schemas/accounts/account-schema";
import type { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";
import { useEffect } from "react";

export const useAccountSocket = ({
  query = {},
}: {
  query: Partial<FindAccountsQueryType>;
}) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.global.access_token);

  useEffect(() => {
    if (!token) {
      return;
    }
    const socket = getSocket(token as string, "/accounts");
    function onConnect() {
      console.log("account socket connected");
    }

    function onDisconnect() {
      console.log("account socket disconnected");
    }

    const handleUpdate = (data: AccountType) => {
      const { _id, ...rest } = data;
      dispatch(
        accountsApi.util.updateQueryData("getAccounts", query, (draft) => {
          const orderToUpdate = draft.accounts.find(
            (prev) => prev._id == _id,
          ) as AccountType;
          if (orderToUpdate) {
            Object.keys(rest).forEach((key: any) => {
              const filed = key as keyof AccountType;
              (orderToUpdate[filed] as any) = data[filed];
            });
          } else {
            console.log("notfound");
          }
        }),
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("balance-updated", handleUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("balance-updated", handleUpdate);
    };
  }, [dispatch, query, token]);

  return {};
};
