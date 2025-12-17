import {
  useGetProductionByIdQuery,
  useUpdateProductionMutation,
} from "@/services/productions";
import { ProductionItemType } from "@/types/production";
import { CreateProductionDtoType } from "@/zod-schemas/productions/create-schema";
import { ProductionItemSchemaType } from "@/zod-schemas/productions/production";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ZodError, ZodIssue } from "zod";

type FormData = Omit<CreateProductionDtoType, "items"> & {
  items: ProductionItemSchemaType[];
};

const defaultValues: FormData = {
  date: new Date().toString(),
  shift: "Day Shift",
  items: [
    {
      remarks: "",
      machine_no: 1,
      amount: 0,
      qty: 0,
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
    },
  ],
};

function useUpdateProduction() {
  const router = useRouter();
  const { id } = useParams();
  const [update] = useUpdateProductionMutation();
  const { data, refetch } = useGetProductionByIdQuery(id as string, {
    skip: Boolean(!id),
  });
  const { control, handleSubmit, setError, reset } = useForm<FormData>({
    defaultValues,
  });

  const itemWatch = useWatch({ control, name: "items" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAppend = () => {
    append({
      ...defaultValues.items[0],
      machine_no: +itemWatch[itemWatch.length - 1]?.machine_no + 1,
    });
  };
  const handleRemove = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (data) {
      reset(data as unknown as FormData);
    }
  }, [data, reset]);

  const getProductionRowAmount = ({
    orderData,
    qty,
  }: {
    orderData: ProductionItemType["order_data"];
    qty: number;
  }) => {
    if (!orderData) {
      return 0;
    }
    if (!qty) {
      return 0;
    }
    const unitQty = orderData.currency !== "USD" ? 1 : 12;
    const amm =
      (qty / unitQty) * orderData.rate * (orderData.exchange_rate || 1);

    return Number(amm.toFixed(2));
  };
  const onSubmit = async (formData: FormData) => {
    try {
      const data = {
        ...formData,
        items: formData.items.map((item) => ({
          ...item,
          order_data: item.order_data._id,
        })),
      };

      const { error } = await update({ formData: data, id: id as string });
      if (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: ZodIssue[] = (error as any)?.data?.errors;
        if (errors.length) {
          handleError(errors);
        }
      } else {
        refetch();
        router.push(`/v1/productions/${id}`);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        handleError(error.issues);
      }
    }
  };

  const handleError = (err: ZodIssue[]) => {
    err.map((err) => {
      const path = typeof err.path == "string" ? err.path : err.path.join(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(path as any, { type: "custom", message: err.message });
    });
  };

  const totalAmount = itemWatch?.reduce((sum, item) => {
    const itemTotal = getProductionRowAmount({
      orderData: item.order_data,
      qty: item.qty,
    });
    return sum + itemTotal;
  }, 0);

  return {
    control,
    handleSubmit,
    items: fields,
    itemWatch,
    handleAppend,
    handleRemove,
    getProductionRowAmount,
    onSubmit,
    totalAmount,
  };
}

export default useUpdateProduction;
