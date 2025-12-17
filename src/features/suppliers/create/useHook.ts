import { useCreateSupplierMutation } from "@/services/suppliers";
import { handleFormError } from "@/utils/handleFormError";
import { useForm } from "react-hook-form";
const defaultValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  balance: 0,
};
const useCreateSupplier = () => {
  const { control, handleSubmit, setError, reset } = useForm({ defaultValues });
  const [create] = useCreateSupplierMutation();
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

export default useCreateSupplier;
