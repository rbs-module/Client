import { useGetProductionByIdQuery } from "@/services/productions";
import { useParams } from "next/navigation";

function useProductionDetails() {
  const { id } = useParams();
  const { data, isFetching, refetch } = useGetProductionByIdQuery(id as string);

  return { production: data, isFetching, refetch, id };
}

export default useProductionDetails;
