import { CreateTransactionBody } from "@/zod-schemas/accounts/create-transaction";
import { useForm, useWatch } from "react-hook-form";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { SupplierType } from "@/types/customer";
import { handleFormError } from "@/utils/handleFormError";
import {
  useCreateExpanseMutation,
  useGetExpensesQuery,
  useGetExpenseVoucherNoQuery,
} from "@/services/expenses";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { landingZeros } from "@/utils/addLandingZero";
import { useAppSelector } from "@/store/hook";

type FormData = Omit<CreateTransactionBody, "destination" | "source"> & {
  destination?: AccountType;
  source?: AccountType;
  supplier?: SupplierType;
  employee?: {
    _id: string;
    name: string;
  };
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
  isDeu: false,
};

function useCreateExpense() {
  //
  //
  // >>==========account ref for update account balance=========>>
  const accountRef = useRef<{ refetch: () => void }>(null);
  // <<==========account ref for update account balance=========<<
  //
  //
  //
  // >>==========RTK=========>>
  const [create] = useCreateExpanseMutation();
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
  const isDeu = useWatch({
    control,
    name: "isDeu",
  });
  const date = useWatch({
    control,
    name: "date",
  });
  // <<==========Hook form=========<<
  //
  //
  //
  const query = useAppSelector((state) => state.expenses.query);
  const { refetch } = useGetExpensesQuery(query);

  //
  // >>==========transformation form data=======>>
  const onSubmit = async (formData: FormData) => {
    const {
      voucher_no,
      description,
      supplier,
      employee,
      source,
      destination,
      ...rest
    } = formData;

    let desc = "";
    switch (formData.type) {
      case "expense":
        desc = `Make Expense`;
        break;

      case "purchase":
        desc = `Make Purchase From ${supplier?.name}`;
        break;

      case "salary_advance":
        desc = `Make Salary Advance to ${employee?.name}`;
        break;

      default:
        break;
    }

    const data: CreateTransactionBody = {
      ...rest,
      source: String(source?._id),
      destination: String(destination?._id),
      reference: [String(supplier?._id)],
      supplier: supplier?._id,
      employee: employee?._id,
      description: description ? description : desc,
      voucher_no: `EX-${format(new Date(rest.date || ""), "yy-MM")}-${voucher_no}`,
    };
    if (type !== "purchase") {
      data.reference = undefined;
    }

    const { error } = await create(data);

    if (error) {
      handleFormError(error, setError);
    } else {
      accountRef.current?.refetch();
      refetch();
      reset({
        ...defaultValues,
        source,
        destination,
        voucher_no: String(landingZeros(Number(voucher_no) + 1, 2)),
        date: new Date(formData.date || "").toISOString(),
      });
    }
  };
  // <<==========transformation form data=======<<
  //
  //
  //
  // >>==========get voucher no=========>>
  const { data } = useGetExpenseVoucherNoQuery(null);
  useEffect(() => {
    setValue(
      "voucher_no",
      data ? String(landingZeros(data.voucher_no, 2)) : "00",
    );
  }, [data, setValue]);

  // >>==========get voucher no=========>>
  //
  //
  //
  // >>==========return hook state=========>>
  return { control, type, accountRef, handleSubmit, onSubmit, isDeu, date };
  // <<==========return hook state=========<<
}

export default useCreateExpense;
// TODO: Add purchase items
