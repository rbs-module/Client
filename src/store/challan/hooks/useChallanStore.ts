import { useAppDispatch, useAppSelector } from "@/store/hook";
import { FindChallanQuery } from "@/types/challan";

const useChallanStore = () => {
  const state = useAppSelector((state) => state.challan);
  const query = state.query;

  const dispatch = useAppDispatch();
  const setQuery = (params: FindChallanQuery) => {
    dispatch({
      type: "challan/setQuery",
      payload: params,
    });
  };

  return { query, setQuery };
};

export default useChallanStore;
