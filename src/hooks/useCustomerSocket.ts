import { getSocket } from "@/socket/socket";
import { useAppSelector } from "@/store/hook";
import { useEffect } from "react";

export const useCustomerSocket = ({
  trigger = () => {},
}: {
  trigger: () => void;
}) => {
  const token = useAppSelector((state) => state.global.access_token);

  useEffect(() => {
    if (!token) {
      return;
    }
    const socket = getSocket(token as string, "/customer");
    function onConnect() {
      //   console.log("Customer socket connected");
    }

    function onDisconnect() {
      //   console.log("Customer socket disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("customer-updated", trigger);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("customer-updated", trigger);
    };
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, trigger]);

  return {};
};
