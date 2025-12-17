import { FindEmployeeQuery, FindPayslipQuery } from "@/types/payroll";
import { useAppDispatch, useAppSelector } from "../hook";

function usePayrollStore() {
  const state = useAppSelector((state) => state.payroll);
  const dispatch = useAppDispatch();
  const setFindEmployeeQuery = (payload: FindEmployeeQuery) => {
    dispatch({
      type: "payroll/setFindEmployeeQuery",
      payload,
    });
  };
  const setFindPayslipQuery = (payload: FindPayslipQuery) => {
    dispatch({
      type: "payroll/setFindPayslipQuery",
      payload,
    });
  };
  const setPayrollCreationMonth = (payload: string) => {
    dispatch({
      type: "payroll/setPayrollCreationMonth",
      payload,
    });
  };

  return {
    setFindEmployeeQuery,
    findEmployeeQuery: state.findEmployeeQuery,
    payrollCreationMonth: state.payrollCreationMonth,
    setPayrollCreationMonth,
    findPayslipQuery: state.FindPayslipQuery,
    setFindPayslipQuery,
  };
}

export { usePayrollStore };
