import { Box, FormControl, FormHelperText, Stack } from "@mui/material";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import IconButtonStyled from "../styled/IconButton";
import { Icons } from "../icons";
import { addMonths, format, subMonths } from "date-fns";

type Props = {
  value?: Date | string;
  error?: string;
  label?: string;
  onChange?: ({ month }: { month: string }) => void;
};
export const MonthPicker = ({
  value = new Date(),
  error,
  onChange = () => {},
}: Props) => {
  return (
    <FormControl error={!!error} fullWidth>
      <Box sx={{ position: "relative" }}>
        <MuiDatePicker
          views={["month", "year"]} // Restrict views to only year and month
          value={new Date(value)}
          onChange={(newValue) =>
            onChange({ month: format(newValue || "", "yyyy-MM") })
          }
        />
      </Box>

      <Stack
        sx={{ position: "absolute", right: 35, top: 4 }}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <IconButtonStyled
          size="xs"
          onClick={() => {
            onChange({
              month: format(subMonths(new Date(value), 1) || "", "yyyy-MM"),
            });
          }}
        >
          <Icons.ArrowBackIosNewIcon />
        </IconButtonStyled>

        <IconButtonStyled
          size="xs"
          onClick={() => {
            onChange({
              month: format(addMonths(new Date(value), 1) || "", "yyyy-MM"),
            });
          }}
        >
          <Icons.ArrowForwardIosIcon />
        </IconButtonStyled>
      </Stack>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
