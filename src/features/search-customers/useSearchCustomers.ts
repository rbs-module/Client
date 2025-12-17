import { useLazySearchQuery } from "@/services/customers";
import { useRef, useState } from "react";
import { useDebounce } from "react-use";

const useSearchCustomers = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState("");

  const [fetchCustomers, { data, isLoading }] = useLazySearchQuery();

  useDebounce(
    () => {
      fetchCustomers({ limit: 50, search: searchText });
    },
    500,
    [searchText]
  );

  return { setSearchText, data, isLoading, inputRef };
};

export default useSearchCustomers;
