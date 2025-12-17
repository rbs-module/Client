import { CreateTransactionBody } from "@/zod-schemas/accounts/create-transaction";
import { useForm, useWatch } from "react-hook-form";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { handleFormError } from "@/utils/handleFormError";
import { format } from "date-fns";
import { useRef } from "react";
import { useCreateManualJournalMutation } from "@/services/accounts";

type FormData = Omit<CreateTransactionBody, "destination" | "source"> & {
  destination?: AccountType;
  source?: AccountType;
};
const defaultValues: FormData = {
  destination: undefined,
  source: undefined,
  amount: 0,
  type: "transfer",
  voucher_no: `00`,
  description: "Make Transfer",
  date: new Date().toISOString(),
};

function useCreateManualJournal() {
  //
  //
  // >>==========account ref for update account balance=========>>
  const accountRef = useRef<{ refetch: () => void }>(null);
  // <<==========account ref for update account balance=========<<
  //
  //
  //
  // >>==========RTK=========>>
  const [create] = useCreateManualJournalMutation();
  // <<==========RTK=========<<
  //
  //
  //
  // >>==========Hook form=========>>
  const { control, handleSubmit, setError, reset } = useForm({ defaultValues });
  const type = useWatch({
    control,
    name: "type",
  });
  // <<==========Hook form=========<<
  //
  //
  //
  // >>==========transformation form data=======>>
  const onSubmit = async (formData: FormData) => {
    const { voucher_no, description, source, destination, ...rest } = formData;
    const data: CreateTransactionBody = {
      ...rest,
      source: String(source?._id),
      destination: String(destination?._id),
      description: description ? description : `Make Transfer`,
      voucher_no: `MJV-${format(new Date(), "yy-MM")}-${voucher_no}`,
    };

    const { error } = await create(data);
    if (error) {
      handleFormError(error, setError);
    } else {
      accountRef.current?.refetch();
      reset({
        ...defaultValues,
        voucher_no: `MJV-${format(new Date(), "yy-MM")}-${Number(voucher_no) + 1}`,
      });
    }
  };
  // <<==========transformation form data=======<<
  //
  //
  //
  // >>==========return hook state=========>>
  return { control, type, accountRef, handleSubmit, onSubmit };
  // <<==========return hook state=========<<
}

export default useCreateManualJournal;
