"use client";
import ToolBarStyled from "@/components/styled/ToolBar";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  Typography,
  TableCellProps,
  Button,
  alpha,
} from "@mui/material";
import useCreateProduction from "./useCreateProduction";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import { shiftEnum } from "@/zod-schemas/productions/production";
import IconButtonStyled from "@/components/styled/IconButton";
import { Icons } from "@/components/icons";
import { SearchOrders } from "@/features/search-orders";
import SimpleBar from "simplebar-react";
import controllerRoles from "@/utils/form-controller-roles";
import { numberWithCommas } from "@/utils/currency-formatter";
import { FormattedOrder } from "@/types/order";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

const TableCell = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      sx={{
        borderLeft: 1,
        borderLeftColor: "divider",
        width: "14%",
        padding: 1,
        ...props.sx,
      }}
    />
  );
};

function CreateProduction() {
  const {
    control,
    items,
    totalAmount,
    handleAppend,
    handleRemove,
    getProductionRowAmount,
    handleSubmit,
    onSubmit,
    isLoading,
  } = useCreateProduction();
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
      <ToolBarStyled>
        <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
          Create Production
        </Typography>
      </ToolBarStyled>
      <Box
        component={SimpleBar}
        sx={(theme) => ({
          border: 1,
          borderColor: "divider",
          borderTop: 0,
          height: "calc(100vh - 100px)",
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          p: 1,
        })}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="date"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  value={field.value}
                  onChange={(value) => field.onChange(value?.toISOString())}
                  error={error?.message}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              control={control}
              name="shift"
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth>
                  <InputLabel>Shift</InputLabel>
                  <Select
                    {...field}
                    error={Boolean(error?.message)}
                    label="Shift"
                  >
                    {shiftEnum.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid2>
        </Grid2>
        <Divider sx={{ my: 1 }} />

        <Table style={{ tableLayout: "fixed", minWidth: 700 }}>
          <TableHead>
            <TableRow
              sx={{
                borderTop: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <TableCell>Machine No</TableCell>
              <TableCell sx={{ width: "25%" }}>Orders</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell
                sx={{ borderLeft: 1, borderRight: 1, borderColor: "divider" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => (
              <TableRow key={item.id + i}>
                <TableCell>
                  <Controller
                    control={control}
                    name={`items.${i}.machine_no`}
                    render={({ field }) => (
                      <InputBase
                        autoFocus
                        onFocus={(e) => {
                          if (e?.target instanceof HTMLInputElement) {
                            e.target.select();
                          }
                        }}
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                        sx={{ px: 2 }}
                        type="number"
                        fullWidth
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ p: 0, px: 0.5 }}>
                  <Controller
                    control={control}
                    rules={controllerRoles}
                    name={`items.${i}.order_data`}
                    render={({ field, fieldState: { error } }) => (
                      <SearchOrders
                        value={field.value as FormattedOrder}
                        key={i}
                        error={error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={control}
                    name={`items.${i}.qty`}
                    render={({ field }) => (
                      <InputBase
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        sx={{ px: 2 }}
                        type="number"
                        fullWidth
                        onFocus={(e) => {
                          if (e?.target instanceof HTMLInputElement) {
                            e.target.select();
                          }
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Controller
                    control={control}
                    name={`items.${i}`}
                    render={({ field: { value } }) => {
                      if (value) {
                        return (
                          <span>
                            {value?.order_data?.currency}{" "}
                            {numberWithCommas(value.order_data?.rate)}
                          </span>
                        );
                      }
                      return <></>;
                    }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <Controller
                    control={control}
                    name={`items.${i}`}
                    render={({ field: { value } }) => {
                      if (value) {
                        return (
                          <strong className="text-right">
                            {numberWithCommas(
                              getProductionRowAmount({
                                orderData: value.order_data,
                                qty: value.qty,
                              }),
                            )}
                          </strong>
                        );
                      }
                      return <></>;
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Controller
                    control={control}
                    name={`items.${i}.remarks`}
                    render={({ field }) => (
                      <InputBase
                        {...field}
                        sx={{ px: 2 }}
                        fullWidth
                        onFocus={(e) => {
                          if (e?.target instanceof HTMLInputElement) {
                            e.target.select();
                          }
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  sx={{ borderLeft: 1, borderRight: 1, borderColor: "divider" }}
                >
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {items.length - 1 == i && (
                      <IconButtonStyled
                        size="xs"
                        onClick={handleAppend}
                        disabled={items.length - 1 !== i}
                      >
                        <Icons.Add />
                      </IconButtonStyled>
                    )}
                    {items.length !== 1 && (
                      <IconButtonStyled
                        size="xs"
                        onClick={() => handleRemove(i)}
                      >
                        <Icons.RemoveRoundedIcon />
                      </IconButtonStyled>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: "bold",
              textShadow: "3px 2px #ff000078",
            }}
          >
            {numberWithCommas(totalAmount)}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <RefreshIcon className="animate-spin" />
              ) : (
                <SaveIcon />
              )
            }
            type="submit"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateProduction;
