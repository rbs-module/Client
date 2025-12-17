import { useLazyGetAccountByIdQuery } from "@/services/accounts";
import { useFetchMyOrganizationAccountsQuery } from "@/services/organization";
import {
  useCreatePaymentMutation,
  useGetPaymentVoucherNoQuery,
} from "@/services/payments";
import { SearchedCustomer } from "@/types/customer";
import { handleFormError } from "@/utils/handleFormError";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { CreatePaymentDTOType } from "@/zod-schemas/Payment";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

type FormData = Omit<
  CreatePaymentDTOType,
  "customer" | "destination_account"
> & {
  customer: SearchedCustomer;
  destination_account?: AccountType;
};

const defaultValues: FormData = {
  amount: 0,
  customer: {
    _id: "",
    name: "",
    balance: 0,
  },
  date: new Date().toISOString(),
  description: "Received Payment",
  mode: "Cash",
  voucher_no: 8,
  destination_account: {
    _id: "",
    account_name: "",
    account_type: "asset",
  } as AccountType,
  cheque_info: {
    bank_name: "",
    branch_name: "",
    cheque_no: "",
    date: new Date().toISOString(),
    image: "",
  },
};
function useCreatePayment() {
  const [create] = useCreatePaymentMutation();
  const { control, setValue, handleSubmit, setError, reset } = useForm({
    defaultValues: { ...defaultValues },
  });
  const mode = useWatch({ control, name: "mode" });
  const payDate = useWatch({ control, name: "date" });

  //
  // get default destination account
  const { data: accountsIds } = useFetchMyOrganizationAccountsQuery(null);
  const [fetchAccount, { data: account }] = useLazyGetAccountByIdQuery();
  //
  // set default destination account
  useEffect(() => {
    if (accountsIds) {
      fetchAccount(accountsIds.cash_account);
    }
  }, [setValue, accountsIds, fetchAccount]);

  //
  // set voucher no
  useEffect(() => {
    if (account) {
      setValue("destination_account", account);
    }
  }, [setValue, account]);

  //
  // get voucher no
  const {
    data: voucherData,
    refetch: refetchVoucherNoData,
    isFetching: isFetchingVoucherNo,
  } = useGetPaymentVoucherNoQuery("");

  //
  // set voucher no
  useEffect(() => {
    if (voucherData?.voucher_no) {
      setValue("voucher_no", voucherData.voucher_no);
    }
  }, [setValue, voucherData]);
  const refetchVoucherNo = async () => {
    await refetchVoucherNoData();
    setValue("voucher_no", voucherData?.voucher_no);
  };

  const onSubmit = async (formData: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: CreatePaymentDTOType = { ...(formData as any) };
    if (mode !== "Cheque") {
      delete data.cheque_info;
    }
    data.customer = formData.customer._id;
    data.destination_account = formData.destination_account?._id;

    const { error } = await create(data);
    if (error) {
      handleFormError(error, setError);
    } else {
      reset({
        customer: defaultValues.customer,
        amount: 0,
        date: new Date(formData.date).toISOString(),
      });
      refetchVoucherNo();
    }
  };

  return {
    control,
    refetchVoucherNo,
    isFetchingVoucherNo,
    mode,
    onSubmit,
    handleSubmit,
    payDate,
  };
}

export default useCreatePayment;
