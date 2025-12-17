import { getDaysInMonth, subMonths } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import { calculateMonthlyPayroll } from "./calculateNetPayble";
import { useParams, useRouter } from "next/navigation";
import {
  useCreatePayslipMutation,
  useGetEmployeeAdvanceQuery,
  useGetEmployeeByIdQuery,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/store/payroll";
import { usePayrollStore } from "@/store/payroll/hooks";
import { handleFormError } from "@/utils/handleFormError";
import toast from "react-hot-toast";
import { Employee } from "@/types/payroll";

type Body = {
  month?: string;
  working_days: number;
  present_days: number;
  absent_days: number;
  leave_days: number;
  overtime_hours: number;
  otherAllowances: number;
  otherDeductions: number;
};
const defaultValues: Body = {
  working_days: getDaysInMonth(subMonths(new Date(), 1)),
  present_days: getDaysInMonth(subMonths(new Date(), 1)),
  absent_days: 0,
  leave_days: 0,
  overtime_hours: 0,
  otherAllowances: 0,
  otherDeductions: 0,
};

const useCreatePayslip = () => {
  const { payrollCreationMonth: month } = usePayrollStore();

  const router = useRouter();
  const activePage = useParams();
  const id = activePage.id as string;
  const { data: employee } = useGetEmployeeByIdQuery(id);
  const { data: advanceAmount } = useGetEmployeeAdvanceQuery(id);

  const { findEmployeeQuery } = usePayrollStore();
  const { data: employeeList, refetch: refetchEmployees } =
    useGetEmployeeQuery(findEmployeeQuery);

  const { ...rest } = useForm<Body>({
    defaultValues: {
      ...defaultValues,
      month: month,
      working_days: getDaysInMonth(new Date(month)),
      present_days: getDaysInMonth(new Date(month)),
    },
  });

  const workingDays = useWatch({ control: rest.control, name: "working_days" });
  const present_days = useWatch({
    control: rest.control,
    name: "present_days",
  });
  const otherAllowances = useWatch({
    control: rest.control,
    name: "otherAllowances",
  });
  const otherDeductions = useWatch({
    control: rest.control,
    name: "otherDeductions",
  });
  const overtime_hours = useWatch({
    control: rest.control,
    name: "overtime_hours",
  });
  const leave_days = useWatch({
    control: rest.control,
    name: "leave_days",
  });
  const absent_days = useWatch({
    control: rest.control,
    name: "absent_days",
  });

  const calculatedData = calculateMonthlyPayroll({
    // present_days: present_days,
    advanceDeduction: advanceAmount ?? 0,
    otherAllowances: otherAllowances ?? 0,
    otherDeductions,
    overtime_hours,
    leave_days,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    employee: employee as any,
    month,
    present_days,
  });

  const formValue = {
    present_days,
    otherAllowances,
    otherDeductions,
    overtime_hours,
    leave_days,
    workingDays,
    absent_days,
    month,
  };

  //   find next employee
  const arr = employeeList?.employee || [];
  const index = arr.findIndex((item) => item._id == id);
  const next = arr[index + 1];

  const [create] = useCreatePayslipMutation();

  const onSubmit = async (data: Body) => {
    const { error } = await create({ body: { ...data, month }, id });
    if (error) {
      handleFormError(error, rest.setError);
    } else {
      toast.success("Payslip Created");
      rest.reset({
        ...defaultValues,
        month: data.month,
      });
      if (next) {
        refetchEmployees();
        router.push(`/v1/payroll/payslips/create/${next._id}`);
      } else {
        router.push(`/v1/payroll/payslips`);
      }
    }
  };

  const [updateEmployee] = useUpdateEmployeeMutation();

  const handleUpdateEmployee = async (body: Partial<Employee>) => {
    const res = await updateEmployee({ body, id: employee?._id || "" });
    if (res.data) {
      router.push(`/v1/payroll/payslips/create/${next._id}`);
      toast.success(res.data.message);
      refetchEmployees();
    }
  };

  return {
    ...rest,
    calculatedData,
    employee,
    formValue,
    onSubmit,
    next,
    handleUpdateEmployee,
  };
};

export default useCreatePayslip;
