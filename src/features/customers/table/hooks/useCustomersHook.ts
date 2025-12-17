// import types ===================>>
import { Customer, FindCustomersQuery } from "@/types/customer";
import { CellEditingStoppedEvent } from "ag-grid-community";
// import types ===================<<

// import redux module >>==========>>
import {
  useGetCustomersQuery,
  useUpdateCustomerMutation,
} from "@/services/customers";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import initialPagination from "@/utils/initial-pagination";
import { setCustomersQuery } from "@/store/customers";
import exportFromJSON from "export-from-json";

// import redux module <<==========<<

export default function useCustomersHook() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.customer.query);
  const { data, isLoading, refetch } = useGetCustomersQuery(query);
  const [update, { isLoading: isLoadingUpdate }] = useUpdateCustomerMutation();

  const handleUpdate = (event: CellEditingStoppedEvent<Customer>) => {
    const oldValue = event.value;
    const newValue = event.newValue;
    const filed = event.colDef.field as keyof Customer;
    if (oldValue !== newValue) {
      update({ formData: { [filed]: newValue }, id: event.data?._id || "" });
    }
  };

  const handleQueryChange = (queryParams: FindCustomersQuery) => {
    const newQuery = { ...query, ...queryParams };
    dispatch(setCustomersQuery(newQuery));
  };
  const handleSearch = (text: string) => {
    handleQueryChange({ search: text, active: !text ? true : false });
  };

  const handleExport = () => {
    const customers = data?.customers;
    const pagination = data?.pagination;
    if (!customers || !Boolean(customers.length)) {
      return alert("No Data Found For Export");
    }

    const fileName = `Customers`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }
    const excelData = customers.map((item) => ({
      name: item.name,
      balance: item.balance,
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };
  return {
    customers: data?.customers || [],
    pagination: data?.pagination || initialPagination,
    handleUpdate,
    isLoading: isLoading || isLoadingUpdate,
    handleQueryChange,
    handleSearch,
    handleExport,
    query,
    refetch,
  };
}
