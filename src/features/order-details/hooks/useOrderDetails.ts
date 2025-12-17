import useGlobalSocket from "@/hooks/useGlobalSocket";
import { useGetOrderByIdQuery } from "@/services/orders";
import { useParams } from "next/navigation";

function useOrderDetails() {
  const activePage = useParams();
  const id = activePage.id as string;
  const {
    data: order,
    isFetching: isLoading,
    refetch,
  } = useGetOrderByIdQuery(id);

  useGlobalSocket({
    path: "/orders",
    events: {
      "order-changes": (data) => {
        if (id == data._id) {
          refetch();
        }
      },
    },
  });
  return { order, isLoading, orderId: id };
}

export default useOrderDetails;
