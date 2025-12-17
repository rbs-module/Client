import { useForm } from "react-hook-form";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { CreateSupplierPaymentBody, SupplierType } from "@/types/customer";
import { handleFormError } from "@/utils/handleFormError";
import { useRef } from "react";
import { useCreateSupplierPaymentMutation } from "@/services/suppliers";
import { useParams } from "next/navigation";

type FormData = {
  source?: AccountType;
  supplier?: SupplierType;
  amount: number;
  description: string;
  date: string;
};

const defaultValues: FormData = {
  source: undefined,
  supplier: undefined,
  amount: 0,
  description: "",
  date: new Date().toISOString(),
};

function useCreateExpense() {
  const id = useParams().id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x: any = {
    _id: id,
    name: "",
  };
  //
  //
  // >>==========account ref for update account balance=========>>
  const accountRef = useRef<{ refetch: () => void }>(null);
  // <<==========account ref for update account balance=========<<
  //
  //
  //
  // >>==========RTK=========>>
  const [create] = useCreateSupplierPaymentMutation();
  // <<==========RTK=========<<
  //
  //
  //
  // >>==========Hook form=========>>
  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      ...defaultValues,
      supplier: x,
    },
  });

  // <<==========Hook form=========<<
  //
  //
  //
  // >>==========transformation form data=======>>
  const onSubmit = async (formData: FormData) => {
    const { description, supplier, source, ...rest } = formData;

    const data: CreateSupplierPaymentBody = {
      ...rest,
      source: String(source?._id),
      supplier: supplier?._id || "",
      description: description
        ? description
        : "Paid To " + supplier?.name || "",
    };

    const { error } = await create(data);
    if (error) {
      handleFormError(error, setError);
    } else {
      accountRef.current?.refetch();
      reset({
        ...defaultValues,
        source,
        date: new Date(formData.date || "").toISOString(),
      });
    }
  };
  // <<==========transformation form data=======<<
  //
  //
  // >>==========return hook state=========>>
  return { control, accountRef, handleSubmit, onSubmit };
  // <<==========return hook state=========<<
}

export default useCreateExpense;
