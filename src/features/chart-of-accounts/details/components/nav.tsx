import ExcelButton from "@/components/buttons/ExcellButton";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import DateRangeSelector from "@/components/DateRangeSelector";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useGetAccountTransactionsQuery } from "@/services/accounts";
import { useAccountsStore } from "@/store/chart-of-accounts/hooks";
import { Stack, Tooltip, Typography } from "@mui/material";
import exportFromJSON from "export-from-json";
import { useParams } from "next/navigation";

type Props = {
  title: string;
};
function AccountDetailsNav({ title }: Props) {
  const activePage = useParams();
  const id = activePage.id as string;
  const {
    transactionsQuery: query,
    handleTransactionsQueryChange: handleQueryChange,
  } = useAccountsStore();
  const { data, refetch, isFetching } = useGetAccountTransactionsQuery({
    id,
    query,
  });

  const handleExport = () => {
    const rows = data?.data.transactions;
    const pagination = data?.pagination;
    if (!rows || !Boolean(rows.length) || pagination?.totalDocuments == 0) {
      return alert("No Data Found For Export");
    }

    const fileName = `${data.data.account_name} / transactions`;

    if (pagination?.totalPages !== 1) {
      return alert(
        `Total Doc Row = "${pagination?.totalDocuments}", \n But Limit = "${pagination?.limit}", \n For Export increase the "Limit"`,
      );
    }

    const excelData = rows.map((item) => ({
      date: item.date_formatted,
      type: item.type,
      description: item.description,
      source: item.source.account_name,
      destination: item.destination.account_name,
      amount: item.amount,
      createdBy: item?.createdBy?.name,
    }));

    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: excelData, fileName, exportType });
  };
  return (
    <ToolBarStyled>
      <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>{title}</Typography>
      <Stack direction={"row"} spacing={1}>
        <Tooltip title="Export">
          <ExcelButton onClick={handleExport} />
        </Tooltip>
        <Tooltip title="Select Date Range">
          <DateRangeSelector
            onChange={handleQueryChange}
            start_date={query.start_date}
            end_date={query.end_date}
            selected={query.label || ""}
          />
        </Tooltip>
        <Tooltip title="Refresh">
          <RefreshButton loading={isFetching} onClick={refetch} />
        </Tooltip>
      </Stack>
    </ToolBarStyled>
  );
}

export default AccountDetailsNav;
