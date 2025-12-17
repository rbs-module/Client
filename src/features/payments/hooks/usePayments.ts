import { useGetPaymentsQuery } from "@/services/payments";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { format } from "date-fns";
import exportFromJSON from "export-from-json";

function usePayments() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.payments.query);
  const { data, isFetching, isLoading, refetch } = useGetPaymentsQuery(query);

  const handleQueryChange = (
    params: Partial<DefaultQueryParamsDTOType & { label: string }>,
  ) => {
    dispatch({
      type: "payments/setPaymentsQuery",
      payload: { ...params },
    });
  };

  const handleExport = () => {
    const pagination = data?.pagination;
    const payments = data?.payments;
    if (!payments || !Boolean(payments.length)) {
      return alert("No Data Found For Export");
    }

    const fileName = `Payments`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }
    const excelData = payments.map((item) => {
      const { date, customer, amount, voucher_no } = item;
      return {
        date: format(date || Date.now(), "dd-MMM-yy"),
        customer: customer.name,
        voucher_no,
        amount,
      };
    });

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };

  return {
    pagination: data?.pagination,
    payments: data?.payments,
    isLoading: isLoading || isFetching,
    query,
    handleExport,
    handleQueryChange,
    refetch,
  };
}

export default usePayments;
