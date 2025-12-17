import { useCreateAccountMutation } from "@/services/accounts";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
const defaultValues: Partial<AccountType> = {
  account_name: "",
  account_type: "expense",
  balance: 0,
  is_active: true,
  is_debit: false,
  is_system_account: false,
  description: "",
};
function useCreateAccount() {
  const { control, handleSubmit, reset, setError } = useForm<AccountType>({
    defaultValues,
  });
  const [create, { isLoading, error, isSuccess }] = useCreateAccountMutation();

  if (error) {
    console.log("error", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = (error as any).data.errors;
    errors.forEach((err: { message: string; path: keyof AccountType }) => {
      if (err.path) {
        setError(err.path, { type: "custom", message: err.message });
      }
    });
  }

  useEffect(() => {
    if (isSuccess) {
      reset(defaultValues);
    }
  }, [isSuccess, reset]);

  const submit = async (data: AccountType) => {
    try {
      await create(data);
    } catch (error) {
      console.log({ error });
    }
  };
  return { control, handleSubmit, isLoading, submit };
}

export default useCreateAccount;
