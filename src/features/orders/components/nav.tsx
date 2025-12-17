import { Box, Stack, Typography } from "@mui/material";

import IconButtonStyled from "@/components/styled/IconButton";
import Link from "next/link";

import type { FormattedOrder, OrdersQuery } from "@/types/order";
import { SearchBar } from "@/components/search-bar";

import SelectStatus from "./selectStatus";
import { Icons } from "@/components/icons";
import UpdateOrdersStatus from "./updateOrdersStatus";
import ToolBarStyled from "@/components/styled/ToolBar";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { useAppSelector } from "@/store/hook";
import { useGetOrdersQuery } from "@/services/orders";
type Props = {
  selectedRows: FormattedOrder[];
  handleQueryChange: (query: OrdersQuery) => void;
};

export const OrdersNav = ({
  handleQueryChange = () => {},
  selectedRows = [],
}: Props) => {
  const handelSearch = (text: string) => {
    handleQueryChange({ search: text });
  };
  const query = useAppSelector((state) => state.orders.query);
  const { isLoading, refetch, isFetching } = useGetOrdersQuery(query);

  return (
    <ToolBarStyled sx={(theme) => ({ my: theme.spacing(1) })}>
      {selectedRows.length ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography>{selectedRows.length} Selected</Typography>
          <UpdateOrdersStatus orders={selectedRows} />
        </Box>
      ) : (
        <>
          <Stack direction={"row"} spacing={2}>
            <SearchBar onChange={handelSearch} />
            <SelectStatus />
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <Link href="/v1/orders/create">
              <IconButtonStyled size="xs" color="success">
                <Icons.Add />
              </IconButtonStyled>
            </Link>
            <RefreshButton
              onClick={refetch}
              loading={isFetching || isLoading}
            />
          </Stack>
        </>
      )}
    </ToolBarStyled>
  );
};
