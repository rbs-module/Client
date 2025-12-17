import { handleFormError } from "@/utils/handleFormError";
import { useForm } from "react-hook-form";
import { useCreateCustomerMutation } from "@/services/customers";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  balance: 0,
};

const useCreateCustomer = () => {
  const { control, handleSubmit, setError, reset } = useForm({ defaultValues });
  const [create] = useCreateCustomerMutation();
  const onSubmit = handleSubmit(async (data) => {
    const { error } = await create({
      ...data,
      balance: data.balance !== 0 ? Number(data.balance) : 0,
    });
    if (error) {
      handleFormError(error, setError);
    } else {
      reset(defaultValues);
    }
  });
  return { control, onSubmit };
};

export default useCreateCustomer;
