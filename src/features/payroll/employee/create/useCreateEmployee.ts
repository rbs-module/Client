import {
  useCreateEmployeeMutation,
  useGetEmployeeIdQuery,
  useGetEmployeeQuery,
} from "@/store/payroll";
import { usePayrollStore } from "@/store/payroll/hooks";
import { Employee } from "@/types/payroll";
import { landingZeros } from "@/utils/addLandingZero";
import { handleFormError } from "@/utils/handleFormError";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  name: "",
  designation: "",
  department: "",
  nid_no: "",
  date_of_birth: "",
  email: "",
  id_no: "",
  joining_date: "",
  phone: "",
  salary: 0,
  image:
    "https://res.cloudinary.com/dbu76a0wo/image/upload/v1764685816/qbuy4mun5b92utwfu9ex.png",
};
function useCreateEmployee() {
  const { control, setValue, setError, handleSubmit, reset } =
    useForm<Employee>({
      defaultValues,
    });

  const [create] = useCreateEmployeeMutation();

  //
  // get employee id
  const { data: employeeIdData, refetch: refetchIdNoData } =
    useGetEmployeeIdQuery();

  //
  // set employee id
  useEffect(() => {
    if (employeeIdData?.id_no) {
      setValue("id_no", String(landingZeros(employeeIdData.id_no, 3)));
    }
  }, [setValue, employeeIdData]);

  const refetchIdNo = async () => {
    await refetchIdNoData();
    setValue("id_no", String(employeeIdData?.id_no));
  };

  // refresh employee table
  const { findEmployeeQuery } = usePayrollStore();
  const { refetch: refetchEmployee } = useGetEmployeeQuery(findEmployeeQuery);

  const onSubmit = async (data: Employee) => {
    const { error } = await create({ ...data, salary: +data.salary });
    if (error) {
      handleFormError(error, setError);
    } else {
      reset({
        ...defaultValues,
      });
      refetchIdNo();
      refetchEmployee();
    }
  };

  return { control, refetchIdNo, handleSubmit, onSubmit };
}

export default useCreateEmployee;
