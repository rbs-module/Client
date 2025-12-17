import { CreateTransactionBody } from "@/zod-schemas/accounts/create-transaction";
import { useForm, useWatch } from "react-hook-form";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { SupplierType } from "@/types/customer";
import { handleFormError } from "@/utils/handleFormError";
import {
  useGetExpensesQuery,
  useUpdateExpanseMutation,
} from "@/services/expenses";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hook";
import useSearchSuppliers from "@/features/search-suppliers/useSearchSuppliers";
import { TransactionFormatted } from "@/types/Transaction";

type FormData = Omit<CreateTransactionBody, "destination" | "source"> & {
  destination?: AccountType;
  source?: AccountType;
  supplier?: SupplierType;
};
const defaultValues: FormData = {
  destination: undefined,
  source: undefined,
  supplier: undefined,
  amount: 0,
  type: "expense",
  voucher_no: `00`,
  sl_no: "",
  description: "",
  date: new Date().toISOString(),
};

function useUpdateExpense() {
  const router = useRouter();
  //
  //
  // >>==========account ref for update account balance=========>>
  const accountRef = useRef<{ refetch: () => void }>(null);
  // <<==========account ref for update account balance=========<<
  //
  //
  //
  // >>==========RTK=========>>
  const [update] = useUpdateExpanseMutation();
  // <<==========RTK=========<<
  //
  //
  //
  // >>==========Hook form=========>>
  const { control, handleSubmit, setError, reset, setValue } = useForm({
    defaultValues,
  });
  const type = useWatch({
    control,
    name: "type",
  });
  const date = useWatch({
    control,
    name: "date",
  });
  // <<==========Hook form=========<<
  //
  //
  //
  // >>==========fetch data=========>>
  const { id } = useParams();
  const query = useAppSelector((state) => state.expenses.query);
  const { data } = useGetExpensesQuery(query);
  const { options } = useSearchSuppliers({ limit: 100 });
  const [transaction, setTransaction] = useState<TransactionFormatted>();
  useEffect(() => {
    if (data?.transactions && id) {
      const find = data.transactions.find((item) => item._id == id);
      if (!find) return;
      setTransaction(find);
      reset({
        date: new Date(find.date).toISOString(),
        type: find.type,
        source: {
          _id: find.source._id,
          account_name: find.source.account_name,
        },
        destination: {
          _id: find.destination._id,
          account_name: find.destination.account_name,
        },
        amount: find.amount,
        voucher_no: find.voucher_no,
        sl_no: find.sl_no,
        description: find.description,
        image: find.image,
      });
    }
  }, [data?.transactions, id, reset]);
  useEffect(() => {
    if (transaction && options) {
      if (
        transaction.type == "purchase" &&
        transaction.reference &&
        transaction.reference[0]
      ) {
        const supplier = options.find(
          (item) => item._id == transaction.reference?.[0],
        );
        if (supplier) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue("supplier", supplier as any);
        }
      }
    }
  }, [transaction, options, setValue]);
  // >>==========fetch data=========>>
  //
  //
  //
  //
  //
  // >>==========transformation form data=======>>
  const onSubmit = async (formData: FormData) => {
    const { voucher_no, description, supplier, source, destination, ...rest } =
      formData;
    const data: CreateTransactionBody = {
      ...rest,
      source: String(source?._id),
      destination: String(destination?._id),
      reference: [String(supplier?._id)],
      voucher_no,
      description: description
        ? description
        : formData.type == "expense"
          ? `Make Expense: ${formData.voucher_no}`
          : `Make Purchase from ${supplier?.name ?? "from " + supplier?.name}`,
    };
    if (type !== "purchase") {
      delete data.reference;
    }

    const { error } = await update({ formData: data, id: String(id) });
    if (error) {
      handleFormError(error, setError);
    } else {
      router.back();
    }
  };
  // <<==========transformation form data=======<<
  //
  //
  //
  // >>==========return hook state=========>>
  return { control, type, accountRef, handleSubmit, onSubmit, date };
  // <<==========return hook state=========<<
}

export default useUpdateExpense;
// TODO: Add purchase items
