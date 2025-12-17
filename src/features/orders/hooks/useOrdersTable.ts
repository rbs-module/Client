import useOrdersSocket from "@/features/orders/hooks/useOrderSocket";
import { useGetOrdersQuery, useUpdateOrderMutation } from "@/services/orders";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setOrdersQuery } from "@/store/orders";
import { FormattedOrder, OrdersQuery } from "@/types/order";
import initialPagination from "@/utils/initial-pagination";
import { CellEditingStoppedEvent, RowSelectedEvent } from "ag-grid-community";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useOrdersTable = () => {
  const [selectedRows, setSelectedRows] = useState<FormattedOrder[]>([]);
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.orders.query);

  useOrdersSocket({ query });

  const { data, isLoading, isError, error, refetch } = useGetOrdersQuery(query);

  useEffect(() => {
    if (isError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err: any = error;
      toast.error(err?.data?.error?.message || "error in fetch orders");
    }
  }, [isError, error]);

  const handleQueryChange = (queryParams: OrdersQuery) => {
    const newQuery = { ...query, ...queryParams };
    dispatch(setOrdersQuery(newQuery));
  };

  const handleRowSelection = ({ api }: RowSelectedEvent<FormattedOrder>) => {
    const selectedRowsData = api.getSelectedNodes().map((node) => node.data);
    setSelectedRows(selectedRowsData as FormattedOrder[]);
  };
  const [updateOrder] = useUpdateOrderMutation();

  const onCellValueChanged = async ({
    oldValue,
    newValue,
    data,
    colDef,
  }: CellEditingStoppedEvent<FormattedOrder>) => {
    try {
      if (oldValue == newValue) {
        return;
      }

      const field = colDef.field as keyof FormattedOrder;
      const id = data?._id || "";

      const { error: updateError } = await updateOrder({
        orderId: id,
        formData: { [field]: newValue },
      });

      if (updateError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err: any = updateError;
        const errors = err.data.errors;
        const msg = err.data.message;
        toast.error(msg || "Failed to update the data");
        errors?.forEach((error: { message: string }) => {
          toast.error(error.message);
        });
      }
    } catch (error) {
      console.error("Failed to update the data:", error);
    }
  };
  return {
    orders: data?.orders || [],
    pagination: data?.pagination || initialPagination,
    handleRowSelection,
    loading: isLoading,
    handleQueryChange,
    onCellValueChanged,
    selectedRows,
    query,
    refetch,
  };
};
