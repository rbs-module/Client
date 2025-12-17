import { BASE_URL } from "@/constant/base-url";
import type {
  CreateOrderBody,
  FormattedOrder,
  GoodsInoutType,
  OrdersQuery,
} from "@/types/order";
import type { Pagination } from "@/types/pagination";
import { objToQueryString } from "@/utils/queryString";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "@/store";
import toast from "react-hot-toast";
import { prepareHeaders } from "../helpers/prepareHeaders";
import { OrderHistoryType } from "@/zod-schemas/orders/history";
import { thisMonthRange } from "@/utils/date-ranges";
import { OrderProduction } from "@/types/production";

type UpdateOrderMutation = {
  formData: Partial<FormattedOrder>;
  orderId: string;
};

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  keepUnusedDataFor: 300,
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/orders`,

    prepareHeaders: prepareHeaders,
  }), // Replace with your API base URL

  endpoints: (builder) => ({
    getOrders: builder.query<
      { orders: FormattedOrder[]; pagination: Pagination },
      OrdersQuery
    >({
      query: (query) => `/find?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getOrderByCustomerId: builder.query<
      { orders: FormattedOrder[]; pagination: Pagination },
      { query: OrdersQuery; id: string }
    >({
      query: ({ query, id }) => `/customer/${id}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getShippedOrders: builder.query<
      { orders: FormattedOrder[]; pagination: Pagination },
      string
    >({
      query: (query) =>
        `/find?limit=100&search=${query}&status=Shipped&search_by=customer`,
      keepUnusedDataFor: 300,
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOrderById: builder.query<FormattedOrder, any>({
      query: (orderId) => `/${orderId}`,
      async onQueryStarted({}, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error.error.data.message || "Order Not FOund");
        }
      },
    }),

    goodsInOut: builder.query<
      GoodsInoutType[],
      { query: typeof thisMonthRange; id: string }
    >({
      query: ({ id, query }) => `/goods-inout/${id}?${objToQueryString(query)}`,
    }),
    getInventoryQty: builder.query<
      { delivery_qty: number; receive_qty: number; production_qty: number },
      { orderId: string; query: typeof thisMonthRange }
    >({
      query: ({ query, orderId }) =>
        `/inventory-qty/${orderId}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    setInventoryQty: builder.mutation({
      query: ({
        orderId,
        formData,
      }: {
        orderId: string;
        formData: {
          delivery_qty: number;
          receive_qty: number;
          production_qty: number;
        };
      }) => ({
        url: `/inventory-qty/${orderId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    createOrder: builder.mutation({
      query: (newOrder: CreateOrderBody) => ({
        url: "/create",
        method: "POST",
        body: newOrder,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const query = state.orders.query;

        const { data } = await queryFulfilled;
        toast.success(data.message || "Order Create Success");
        dispatch(
          ordersApi.util.updateQueryData("getOrders", query, (draft) => {
            draft.orders.unshift(data.data);
          }),
        );
      },
    }),
    clone: builder.mutation({
      query: (orderId: string) => ({
        url: `/clone/${orderId}`,
        method: "PATCH",
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const query = state.orders.query;

        const { data } = await queryFulfilled;
        toast.success(data.message || "Order Clone Success");
        dispatch(
          ordersApi.util.updateQueryData("getOrders", query, (draft) => {
            draft.orders.unshift(data.data);
          }),
        );
      },
    }),

    updateOrder: builder.mutation({
      query: ({ formData, orderId }: UpdateOrderMutation) => ({
        url: `/update/${orderId}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({ formData, orderId }, { dispatch, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.orders.query;
          dispatch(
            ordersApi.util.updateQueryData("getOrders", query, (draft) => {
              const orderToUpdate = draft.orders.find(
                (order) => order._id == orderId,
              );

              if (orderToUpdate) {
                Object.assign(orderToUpdate, formData);
              } else {
                console.log("notfound");
              }
            }),
          );
          toast.success("Order updated successfully");
        } catch (error) {
          console.log("err", error);
        }
      },
    }),
    updateOrdersStatus: builder.mutation({
      query: (formData: {
        ids: string[];
        status: FormattedOrder["status"];
      }) => ({
        url: `/update-status`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted({ ids, status }, { dispatch, getState }) {
        try {
          const state = getState() as RootState;
          const query = state.orders.query;
          dispatch(
            ordersApi.util.updateQueryData("getOrders", query, (draft) => {
              draft.orders.map((item) => {
                if (ids.includes(item._id)) {
                  item.status = status;
                }
              });
            }),
          );
          toast.success("Order updated successfully");
        } catch (error) {
          console.log("err", error);
        }
      },
    }),
    deleteOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/${orderId}`,
        method: "DELETE",
      }),
      async onQueryStarted(orderId, { dispatch, getState, queryFulfilled }) {
        try {
          const state = getState() as RootState;
          const query = state.orders.query;
          dispatch(
            ordersApi.util.updateQueryData("getOrders", query, (draft) => {
              draft.orders = draft.orders.filter(
                (item) => item._id !== orderId,
              );
            }),
          );
          await queryFulfilled;
          toast.success("Order deleted successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const message = error?.error?.data?.message;

          toast.error(message || "error in delete order");
        }
      },
    }),
    getOrderHistory: builder.query<
      { history: OrderHistoryType[]; pagination: Pagination },
      {
        query: { page: number; limit: number; sort_type: "asc" | "desc" };
        id: string;
      }
    >({
      query: ({ id, query }) => `/history/${id}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    getOrderComments: builder.query<
      { comments: OrderHistoryType[]; pagination: Pagination },
      {
        query: { page: number };
        id: string;
      }
    >({
      query: ({ id, query }) => `/comments/${id}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),

    getOrderProductions: builder.query<
      OrderProduction[],
      {
        id: string;
        query: typeof thisMonthRange;
      }
    >({
      query: ({ id, query }) => `/productions/${id}?${objToQueryString(query)}`,
      keepUnusedDataFor: 300,
    }),
    addComments: builder.mutation({
      query: ({
        formData,
        orderId,
      }: {
        orderId: string;
        formData: { comments: string };
      }) => ({
        url: `/comments/${orderId}`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_orderId, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Comments create successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const message = error?.error?.data?.message;
          toast.error(message || "error in delete order");
        }
      },
    }),
    getGallery: builder.query<
      {
        gallery: string[];
        cover_photo: string;
        order_name: string;
        _id: string;
      } | null,
      {
        id: string;
      }
    >({
      query: ({ id }) => `/gallery/${id}`,
      keepUnusedDataFor: 300,
    }),
    addGallery: builder.mutation({
      query: ({
        formData,
        orderId,
      }: {
        orderId: string;
        formData: { gallery: string[] };
      }) => ({
        url: `/gallery/${orderId}`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(_orderId, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Comments create successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const message = error?.error?.data?.message;
          toast.error(message || "error in delete order");
        }
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByCustomerIdQuery,
  useLazyGetOrderByCustomerIdQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useLazyGetShippedOrdersQuery,
  useUpdateOrdersStatusMutation,
  useGetOrderHistoryQuery,
  useGetOrderCommentsQuery,
  useLazyGetOrderCommentsQuery,
  useLazyGetOrdersQuery,
  useAddCommentsMutation,
  useCloneMutation,
  useGoodsInOutQuery,
  useGetOrderProductionsQuery,
  useLazyGetInventoryQtyQuery,
  useGetInventoryQtyQuery,
  useSetInventoryQtyMutation,
  useGetGalleryQuery,
  useAddGalleryMutation,
  util,
  reducer,
} = ordersApi;
