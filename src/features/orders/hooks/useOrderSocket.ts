import { util } from "@/services/orders";
import { getSocket } from "@/socket/socket";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import type { FormattedOrder, OrdersQuery } from "@/types/order";
import { useEffect } from "react";

const useOrdersSocket = ({ query }: { query: OrdersQuery }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.global.access_token);

  useEffect(() => {
    const socket = getSocket(token as string);

    function onConnect() {
      console.log("Order socket connected");
    }

    function onDisconnect() {
      console.log("Order socket disconnected");
    }

    function onChangeOrder(value: Partial<FormattedOrder>) {
      if (value._id) {
        handleUpdateOrder({ id: value._id, value });
      }
    }

    socket.on("error", () => {
      console.log("error");
    });
    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);
    socket.on("order-changes", onChangeOrder);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("order-changes", onChangeOrder);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateOrder = ({
    id,
    value,
  }: {
    id: string;
    value: Partial<FormattedOrder>;
  }) => {
    //1= value = inventory.production_qty : 100 //its not working
    //2= value = order_name : "order-1" //its work

    dispatch(
      util.updateQueryData("getOrders", query, (draft) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orderToUpdate: any = draft.orders.find(
          (order) => order._id == id,
        );
        if (orderToUpdate) {
          Object.keys(value).forEach((key) => {
            if (key.includes("inventory")) {
              const nField = key.split(".")[1] as keyof FormattedOrder;
              orderToUpdate.inventory[nField] =
                value[key as keyof FormattedOrder];
            } else {
              const filed = key as keyof FormattedOrder;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (orderToUpdate[filed] as any) = value[filed];
            }
          });
        } else {
          console.log("notfound");
        }
      }),
    );
  };

  return {};
};

export default useOrdersSocket;
