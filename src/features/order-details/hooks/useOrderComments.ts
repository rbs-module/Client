import { useGetOrderCommentsQuery, util } from "@/services/orders";
import { getSocket } from "@/socket/socket";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import type { OrderHistoryType } from "@/zod-schemas/orders/history";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useOrderComments = () => {
  const activePage = useParams();
  const orderId = activePage.id as string;

  const [page, setPage] = useState(1);

  const query = {
    id: orderId,
    query: { page },
  };

  const { isFetching, data: comments } = useGetOrderCommentsQuery(query, {
    refetchOnFocus: true,
  });

  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.global.access_token);

  useEffect(() => {
    const socket = getSocket(token as string);
    function onConnect() {}

    function onDisconnect() {}

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("comments-created", onCommentsCreated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("comments-created", onCommentsCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCommentsCreated = (history: OrderHistoryType) => {
    dispatch(
      util.updateQueryData("getOrderComments", query, (draft) => {
        draft.comments = [...draft.comments, history];
      }),
    );
  };

  return { isFetching, comments: comments?.comments || [], setPage, orderId };
};

export default useOrderComments;
