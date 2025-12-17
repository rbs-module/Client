import {
  useGetChallanByIdFormattedQuery,
  useGetChallanByIdQuery,
  useUpdateChallanMutation,
} from "@/store/challan/api";
import { CreateChallanBody } from "@/types/challan";
import { handleFormError } from "@/utils/handleFormError";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
const defaultValues: CreateChallanBody = {
  carrier_name: "",
  challan_no: 100,
  customer: {
    _id: "",
    name: "",
    balance: 0,
  },
  type: "Delivery",
  date: new Date().toString(),
  items: [
    {
      color: "",
      embroidery_reject: 0,
      fabric_reject: 0,
      order_data: {
        rate: 0,
        currency: "BDT",
        exchange_rate: 1,
        order_name: "",
        _id: "",
        cover_photo: "",
        sl_no: "",
        unit: "Pcs",
      },
      qty: 0,
      size: "",
    },
  ],
};

function useUpdateChallan() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { refetch: refetchFormattedData } = useGetChallanByIdFormattedQuery(id);

  const { data, refetch } = useGetChallanByIdQuery(String(id));

  const { control, handleSubmit, setError, reset } = useForm<CreateChallanBody>(
    {
      defaultValues,
    },
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reset(data as any);
  }, [data, reset]);

  const itemsWatch = useWatch({ control, name: "items" });
  const selectedCustomer = useWatch({ control, name: "customer" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAppend = () => {
    append({
      ...defaultValues.items[0],
      color: itemsWatch[itemsWatch.length - 1].color,
      order_data: { ...itemsWatch[itemsWatch.length - 1].order_data },
    });
  };
  const handleRemove = (index: number) => {
    remove(index);
  };
  const [update] = useUpdateChallanMutation();

  const onSubmit = handleSubmit(async (data) => {
    const formData = {
      ...data,
      customer: data.customer?._id,
      items: data.items.map((item) => ({
        ...item,
        order_data: item.order_data._id,
      })),
    };

    const { error } = await update({
      formData: formData as CreateChallanBody,
      id,
    });
    if (error) {
      handleFormError(error, setError);
    } else {
      await refetch();
      refetchFormattedData();
      reset({
        ...defaultValues,
        challan_no: formData.challan_no + 1,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
        customer: data.customer,
      });
      router.push(`/v1/challan/${id}`);
    }
  });

  return {
    control,
    items: fields,
    selectedCustomer,
    itemsWatch,
    onSubmit,
    handleAppend,
    handleRemove,
  };
}

export default useUpdateChallan;
