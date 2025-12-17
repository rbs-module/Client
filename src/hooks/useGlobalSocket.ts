import { getSocket } from "@/socket/socket";
import { useAppSelector } from "@/store/hook";
import { useEffect } from "react";

type Params = {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: Record<string, (data: any) => void>;
};
function useGlobalSocket({ path, events }: Params) {
  const token = useAppSelector((state) => state.global.access_token);

  useEffect(() => {
    const socket = getSocket(token as string, path);
    Object.keys(events).forEach((key) => {
      socket.on(key, events[key]);
    });

    return () => {
      Object.keys(events).forEach((key) => {
        socket.off(key, events[key]);
      });
    };
  }, [events, path, token]);
}

export default useGlobalSocket;
