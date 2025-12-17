import { useState, useEffect, useMemo } from "react";
import { useGetOrdersQuery, useLazyGetOrdersQuery } from "@/services/orders";
import { useAppSelector } from "@/store/hook";
import { FormattedOrder } from "@/types/order";

import { useDebounce } from "react-use";
import { orderStatusEnum } from "@/constant/order";

function useSearchOrder() {
  const [localData, setLocalData] = useState<FormattedOrder[]>([]);
  const query = useAppSelector((state) => state.orders.query);

  const remove = ["Invoiced", "Develop", "Cancelled"];
  const fixedStatus = orderStatusEnum
    .map((status) => {
      if (remove.includes(status)) {
        return null;
      }
      return status;
    })
    .join(" ");

  const {
    data: initialData,
    isFetching: isLoading,
    refetch,
  } = useGetOrdersQuery({
    ...query,
    limit: 101,
    status: fixedStatus,
  });
  const [fetchItems, { data, isFetching }] = useLazyGetOrdersQuery();
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
        fetchItems({ search: searchTerm });
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
    return orders;
  }, [localData, data]);

  return {
    options,
    isLoading: isLoading || isFetching,
    searchTerm,
    refresh: refetch,
    handleInputChange,
  };
}

export default useSearchOrder;
