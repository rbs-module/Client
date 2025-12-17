import { useState, useEffect, useMemo } from "react";

import { useDebounce } from "react-use";
import type { SupplierType } from "@/types/customer";
import type { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import {
  useGetSuppliersQuery,
  useLazyGetSuppliersQuery,
} from "@/services/suppliers";

function useSearchSuppliers(defaultQuery: Partial<DefaultQueryParamsDTOType>) {
  const [localData, setLocalData] = useState<SupplierType[]>([]);
  const [query] = useState<Partial<DefaultQueryParamsDTOType>>({
    limit: 100,
    page: 1,
    ...defaultQuery,
  });

  const { data: initialData, isFetching: isLoading } =
    useGetSuppliersQuery(query);
  const [fetchItems, { data, isFetching }] = useLazyGetSuppliersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialData?.suppliers) {
      setLocalData(initialData.suppliers);
    }
  }, [initialData]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };
  useDebounce(
    () => {
      if (!searchTerm.trim()) return setLocalData(initialData?.suppliers || []);
      const filteredData = initialData?.suppliers.filter((item) => {
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
    if (data?.suppliers) {
      setLocalData(data.suppliers);
    }
  }, [data]);

  const options: SupplierType[] = useMemo(() => {
    const suppliers = localData.length > 0 ? localData : data?.suppliers || [];
    return suppliers;
  }, [localData, data]);

  return {
    options,
    isLoading: isLoading || isFetching,
    searchTerm,

    handleInputChange,
  };
}

export default useSearchSuppliers;
