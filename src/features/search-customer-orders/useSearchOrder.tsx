import { useState, useEffect, useMemo } from "react";
import {
  useGetOrderByCustomerIdQuery,
  useLazyGetOrderByCustomerIdQuery,
} from "@/services/orders";
import { useAppSelector } from "@/store/hook";
import { FormattedOrder } from "@/types/order";

import { useDebounce } from "react-use";
import { orderStatusEnum } from "@/constant/order";

function useSearchOrderByCustomerId({ customerId }: { customerId: string }) {
  const [localData, setLocalData] = useState<FormattedOrder[]>([]);
  const query = useAppSelector((state) => state.orders.query);
  const fixedStatus = orderStatusEnum
    .filter((status) => status !== "Invoiced")
    .join(" ");
  const {
    data: initialData,
    isFetching: isLoading,
    refetch,
  } = useGetOrderByCustomerIdQuery(
    {
      query: { ...query, limit: 101, status: fixedStatus },
      id: customerId,
    },
    { skip: !customerId },
  );
  const [fetchItems, { data, isFetching }] = useLazyGetOrderByCustomerIdQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialData?.orders) {
      setLocalData(initialData.orders);
    }
  }, [initialData]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };
  useDebounce(
    () => {
      if (!searchTerm.trim()) return setLocalData(initialData?.orders || []);

      setSearchTerm(searchTerm);
      const filteredData = initialData?.orders.filter((item) => {
        const tags = `${item.sl_no} ${item.order_name} ${item.customer.name}`;
        return tags.toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (filteredData && filteredData.length > 0) {
        setLocalData(filteredData);
      } else {
        fetchItems({ query: { search: searchTerm }, id: customerId });
      }
    },
    500,
    [searchTerm],
  );

  useEffect(() => {
    if (data?.orders) {
      setLocalData(data.orders);
    }
  }, [data]);

  const options: FormattedOrder[] = useMemo(() => {
    const orders = localData.length > 0 ? localData : data?.orders || [];
    return orders.map((order) => ({ ...order }));
  }, [localData, data]);
  // const options: AsyncOption<FormattedOrder>[] = useMemo(() => {
  //   const orders = localData.length > 0 ? localData : data?.orders || [];
  //   return orders.map((order) => ({
  //     value: order,
  //     label: (
  //       <Stack direction={"row"} spacing={2} alignItems={"center"} py={0.5}>
  //         <Avatar src={ImageUrlConfig(order.cover_photo, "w_50,h_50,r_max")} />
  //         <Box>
  //           <strong>
  //             # {order.sl_no} {order.order_name}
  //           </strong>
  //           <br />
  //           <span className="truncate">{order.customer.name}</span>
  //         </Box>
  //       </Stack>
  //     ),
  //   }));
  // }, [localData, data]);

  return {
    options,
    isLoading: isLoading || isFetching,
    searchTerm,
    refresh: refetch,
    handleInputChange,
  };
}

export default useSearchOrderByCustomerId;
