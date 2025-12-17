// import types ===================>>
import { Customer, FindCustomersQuery } from "@/types/customer";
import { CellEditingStoppedEvent } from "ag-grid-community";
// import types ===================<<

// import redux module >>==========>>
import { useUpdateCustomerMutation } from "@/services/customers";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import initialPagination from "@/utils/initial-pagination";
import { setCustomersQuery } from "@/store/customers";
import exportFromJSON from "export-from-json";
import { useGetSuppliersQuery } from "@/services/suppliers";

// import redux module <<==========<<

export default function useSuppliersTable() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.customer.query);
  const { data, isLoading, refetch } = useGetSuppliersQuery(query);
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
    handleQueryChange({ search: text });
  };

  const handleExport = () => {
    const suppliers = data?.suppliers;
    const pagination = data?.pagination;
    if (!suppliers || !Boolean(suppliers.length)) {
      return alert("No Data Found For Export");
    }

    const fileName = `Suppliers`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }
    const excelData = suppliers.map((item) => ({
      name: item.name,
      balance: item.balance,
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };
  return {
    suppliers: data?.suppliers || [],
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
