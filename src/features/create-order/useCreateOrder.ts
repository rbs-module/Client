import { useCreateOrderMutation } from "@/services/orders";
import { CreateOrderBody } from "@/types/order";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
const defaultValues = {
  order_name: "",
  currency: "BDT",
  unit: "Pcs",
  rate: 0,
  qty: 0,
  exchange_rate: 1,
  customer: {
    _id: "",
    name: "",
  },
  properties: [],
  description: "",
};
const useCreateOrder = () => {
  const { control, handleSubmit, setError, reset } = useForm<CreateOrderBody>({
    defaultValues,
  });
  const currency = useWatch({
    control,
    name: "currency",
  });
  const { fields, append, prepend, remove } = useFieldArray({
    control,
    name: "properties",
  });

  const [create, { isLoading, error }] = useCreateOrderMutation();

  if (error) {
    console.log("error", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = (error as any).data.errors;
    errors.forEach((err: { message: string; path: keyof CreateOrderBody }) => {
      if (err.path) {
        setError(err.path, { type: "custom", message: err.message });
      }
    });
  }

  const onSubmit = async (formData: CreateOrderBody) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      ...formData,
      customer: formData.customer._id,
      exchange_rate: Number(formData.exchange_rate),
      // gallery: [formData.cover_photo],
    };
    await create(data);
    reset(defaultValues);
  };
  return {
    control,
    currency,
    handleSubmit,
    onSubmit,
    fields,
    append,
    prepend,
    remove,
    isLoading,
  };
};
export default useCreateOrder;
