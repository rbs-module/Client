import { Icons } from "@/components/icons";
import { MonthPicker } from "@/components/MonthPicker";
import IconButtonStyled from "@/components/styled/IconButton";
import ToolBarStyled from "@/components/styled/ToolBar";
import { useFindDepartmentsQuery, useGetPayslipsQuery } from "@/store/payroll";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import RefreshLoading from "@/components/Loading/RefreshLoading";
import { usePayrollStore } from "@/store/payroll/hooks";
import { useMenu } from "@/hooks/useMenu";
import Row from "@/components/Row";

const PayslipNav = () => {
  const { setFindPayslipQuery: handleQueryChange, findPayslipQuery: query } =
    usePayrollStore();
  const { refetch, isFetching, isLoading } = useGetPayslipsQuery(query);

  const { data: departments } = useFindDepartmentsQuery({});

  const { handleOpen, anchorEl, open, handleClose } = useMenu();
  return (
    <>
      <Menu onClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            handleQueryChange({ department: "All" });
            handleClose();
          }}
          selected={query.department == "All"}
        >
          All
        </MenuItem>
        {departments?.departments.map(({ name, _id }) => (
          <MenuItem
            onClick={() => {
              handleQueryChange({ department: name });
              handleClose();
            }}
            selected={query.department == name}
            key={_id}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
      <RefreshLoading isLoading={isFetching || isLoading} />
      <ToolBarStyled sx={{ my: 1 }}>
        <Typography variant="h6">Payslips</Typography>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Box>
            <Tooltip title="Department" placement="top">
              <Button onClick={handleOpen}>
                <Row sx={{ justifyItems: "center", alignItems: "center" }}>
                  <Typography sx={{ textWrap: "nowrap" }}>
                    {query.department || "All"}
                  </Typography>
                  <Icons.ChevronLeftIcon className="-rotate-90" />
                </Row>
              </Button>
            </Tooltip>
          </Box>

          <MonthPicker value={query.month} onChange={handleQueryChange} />
          <IconButtonStyled component={Link} href="/v1/payroll/payslips/create">
            <Icons.Add />
          </IconButtonStyled>
          <RefreshButton onClick={refetch} />
          <IconButtonStyled component={Link} href="payslips/print">
            <Icons.PrintIcon />
          </IconButtonStyled>
        </Stack>
      </ToolBarStyled>
    </>
  );
};

export default PayslipNav;
