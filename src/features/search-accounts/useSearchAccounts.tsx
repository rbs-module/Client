import { useState, useEffect, useMemo } from "react";

import { AccountType } from "@/zod-schemas/accounts/account-schema";
import {
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
} from "@/services/accounts";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";
import { useDebounce } from "react-use";
import { useAccountSocket } from "@/hooks/useAccountSocket";

function useSearchAccounts(defaultQuery: Partial<FindAccountsQueryType>) {
  const [localData, setLocalData] = useState<AccountType[]>([]);
  const [query] = useState<Partial<FindAccountsQueryType>>({
    limit: 100,
    page: 1,
    ...defaultQuery,
  });
  useAccountSocket({ query });
  const {
    data: initialData,
    isFetching: isLoading,
    refetch,
  } = useGetAccountsQuery(query);

  const [fetchItems, { data, isFetching }] = useLazyGetAccountsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (initialData?.accounts) {
      setLocalData(initialData.accounts);
    }
  }, [initialData]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };
  useDebounce(
    () => {
      if (!searchTerm.trim()) return setLocalData(initialData?.accounts || []);
      const filteredData = initialData?.accounts.filter((item) => {
        const tags = `${item.account_name}`;
        return tags.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (filteredData && filteredData.length > 0) {
        setLocalData(filteredData);
      } else {
        fetchItems({ ...query, ...defaultQuery, search: searchTerm });
      }
    },
    500,
    [searchTerm],
  );

  useEffect(() => {
    if (data?.accounts) {
      setLocalData(data.accounts);
    }
  }, [data]);

  const options: AccountType[] = useMemo(() => {
    const accounts = localData.length > 0 ? localData : data?.accounts || [];
    return accounts;
  }, [localData, data]);

  return {
    options,
    isLoading: isLoading || isFetching,
    searchTerm,
    refetch,
    handleInputChange,
  };
}

export default useSearchAccounts;
