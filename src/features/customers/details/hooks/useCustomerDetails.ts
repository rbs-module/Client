"use client";

import { useCustomerSocket } from "@/hooks/useCustomerSocket";
import { useGetCustomerByIdQuery } from "@/services/customers";
import { useParams } from "next/navigation";

function useCustomerDetails() {
  const { id } = useParams();
  const { data, isFetching, isLoading, refetch } = useGetCustomerByIdQuery(
    id as string,
  );
  useCustomerSocket({ trigger: refetch });

  return { data, isLoading: isFetching || isLoading };
}

export default useCustomerDetails;
