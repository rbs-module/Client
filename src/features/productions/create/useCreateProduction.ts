import { useCreateProductionMutation } from "@/services/productions";
import { ProductionItemType } from "@/types/production";
import { CreateProductionDtoType } from "@/zod-schemas/productions/create-schema";
import { ProductionItemSchemaType } from "@/zod-schemas/productions/production";
import { addDays, subDays } from "date-fns";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ZodError, ZodIssue } from "zod";

type FormData = Omit<CreateProductionDtoType, "items"> & {
  items: ProductionItemSchemaType[];
};
const today = new Date(); // Get the current date and time
const yesterday = subDays(today, 1); // Subtract one day from today

const defaultValues: FormData = {
  date: yesterday.toISOString(),
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

function useCreateProduction() {
  const [create, { isLoading }] = useCreateProductionMutation();
  const { control, handleSubmit, setError, setValue } = useForm<FormData>({
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

      const { error } = await create(data);
      if (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors: ZodIssue[] = (error as any)?.data?.errors;
        if (errors.length) {
          handleError(errors);
        }
      } else {
        if (formData.shift == "Night Shift") {
          const nextDay = addDays(formData.date, 1);
          setValue("date", nextDay.toISOString());
        }
        setValue(
          "shift",
          formData.shift == "Day Shift" ? "Night Shift" : "Day Shift",
        );
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

  const totalAmount = itemWatch.reduce((sum, item) => {
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
    isLoading,
  };
}

export default useCreateProduction;
