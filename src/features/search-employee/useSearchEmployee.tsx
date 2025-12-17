import { useState, useEffect, useMemo } from "react";

import { useDebounce } from "react-use";

import type { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { Employee } from "@/types/payroll";
import { useGetEmployeeQuery, useLazyGetEmployeeQuery } from "@/store/payroll";

function useSearchEmployee(defaultQuery: Partial<DefaultQueryParamsDTOType>) {
  const [localData, setLocalData] = useState<Employee[]>([]);
  const [query] = useState<Partial<DefaultQueryParamsDTOType>>({
    limit: 100,
    page: 1,
    ...defaultQuery,
  });

  const { data: initialData, isFetching: isLoading } =
    useGetEmployeeQuery(query);
  const [fetchItems, { data, isFetching }] = useLazyGetEmployeeQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialData?.employee) {
      setLocalData(initialData.employee);
    }
  }, [initialData]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };
  useDebounce(
    () => {
      if (!searchTerm.trim()) return setLocalData(initialData?.employee || []);
      const filteredData = initialData?.employee.filter((item) => {
        const tags = `${item.name}`;
        return tags.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (filteredData && filteredData.length > 0) {
        setLocalData(filteredData);
      } else {
        fetchItems({ ...query, search: searchTerm });
      }
    },
    500,
    [searchTerm],
  );

  useEffect(() => {
    if (data?.employee) {
      setLocalData(data.employee);
    }
  }, [data]);

  const options: Employee[] = useMemo(() => {
    const employee = localData.length > 0 ? localData : data?.employee || [];
    return employee;
  }, [localData, data]);

  return {
    options,
    isLoading: isLoading || isFetching,
    searchTerm,

    handleInputChange,
  };
}

export default useSearchEmployee;
