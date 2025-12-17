"use client";
import { useLazyGetOrderByCustomerIdQuery } from "@/services/orders";
import {
  useCreateQuotationMutation,
  useGetPriceQuotationsQuery,
  useLazyGetQuotationNoQuery,
} from "@/services/price-quotation";
import { useAppSelector } from "@/store/hook";
import { SearchedCustomer } from "@/types/customer";
import { FormattedOrder } from "@/types/order";
import { landingZeros } from "@/utils/addLandingZero";
import { InvoiceCreateDtoType } from "@/zod-schemas/invoice";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

type FormData = InvoiceCreateDtoType & { customer: SearchedCustomer };

const defaultItem = {
  cover_photo:
    "https://res.cloudinary.com/dbu76a0wo/image/upload/v1751887158/jvdhdmcyrtzqnub022l5.png",
  currency: "BDT",
  created_at: new Date(),
  exchange_rate: 1,
  order_name: "",
  qty: 1,
  rate: 1,
  sl_no: "",
  unit: "Pcs",
  orderId: "686fc140d8efe1923ad314a5",
};

const defaultValues = {
  date: new Date(),
  cover_photo: "",
  discountPercent: 0,
  invoiceNo: "",
  customer: {
    _id: "",
    name: "",
  },
  items: [],
};
function usePriceQuotationForm() {
  // form handler =======================>>

  const { control, handleSubmit, setError, reset, setValue } =
    useForm<FormData>({
      defaultValues,
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const appendDefault = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    append({ ...(defaultItem as any) });
  };

  const selectedCustomer = useWatch({ control, name: "customer" });
  const invDate = useWatch({ control, name: "date" });
  const selectedItems = useWatch({ control, name: "items" });
  const [fetchOrders, { data: orderData }] = useLazyGetOrderByCustomerIdQuery();

  const [orders, setOrders] = useState<FormattedOrder[]>([]);

  useEffect(() => {
    if (orderData?.orders) {
      setOrders(orderData.orders);
    }
  }, [orderData]);

  useEffect(() => {
    if (selectedCustomer?._id) {
      fetchOrders({ id: selectedCustomer._id ?? "", query: { limit: 1000 } });
    }
  }, [fetchOrders, selectedCustomer]);

  const handleSelectOrder = (order: FormattedOrder) => {
    const orderId = order._id;
    const find = orders.find((item) => item._id == orderId);
    if (find) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      append(order as any);
    }
    setOrders((pr) => pr.filter((item) => item._id !== orderId));
  };
  const handleRemove = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOrders((p) => [...p, fields[index] as any]);
    remove(index);
  };
  const [create, { isLoading, error, isSuccess }] =
    useCreateQuotationMutation();

  //
  // get voucher no
  const [fetchQuotationNo, { data: invData }] = useLazyGetQuotationNoQuery({});

  //
  // set voucher no
  useEffect(() => {
    const invoiceNo = invData?.data ?? "";
    if (selectedCustomer?._id) {
      fetchQuotationNo(selectedCustomer?._id);
    }

    if (invoiceNo) {
      setValue("invoiceNo", invoiceNo);
    }
  }, [setValue, invData, fetchQuotationNo, selectedCustomer]);

  useEffect(() => {
    if (isSuccess) {
      reset(defaultValues);
      setOrders([]);
    }
  }, [isSuccess, reset]);

  if (error) {
    console.log("error", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = (error as any).data.errors;
    errors.forEach(
      (err: { message: string; path: keyof InvoiceCreateDtoType }) => {
        if (err.path) {
          setError(err.path, { type: "custom", message: err.message });
        }
      },
    );
  }
  const query = useAppSelector((state) => state.priceQut.query);
  const { refetch } = useGetPriceQuotationsQuery(query);
  const submit = async (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any = data.items.map((item, index) => ({
      ...item,
      orderId: item._id ?? item.orderId,
      sl_no: item.sl_no !== "" ? item.sl_no : landingZeros(index, 1),
    }));

    const formData: InvoiceCreateDtoType = {
      ...data,
      cover_photo: items[0].cover_photo,
      customer: data.customer._id,
      items,
    };

    await create(formData);
    refetch();
  };
  return {
    control,
    orders,
    handleSelectOrder,
    handleRemove,
    submit,
    handleSubmit,
    isLoading,
    invDate,
    selectedItems,
    items: fields,
    appendDefault,
  };
}

export default usePriceQuotationForm;
