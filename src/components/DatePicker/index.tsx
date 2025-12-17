import { Box, FormControl, FormHelperText, Stack } from "@mui/material";
import {
  DatePickerProps,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import IconButtonStyled from "../styled/IconButton";
import { Icons } from "../icons";
import { addDays, subDays } from "date-fns";

type Props = {
  value?: Date | string;
  error?: string;
  label?: string;
  onChange?: (value: Date | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DatePickerProps?: DatePickerProps<any>;
};
export const DatePicker = ({
  value = new Date(),
  error,
  label,
  onChange = () => {},
  DatePickerProps,
}: Props) => {
  return (
    <FormControl error={!!error} fullWidth>
      <Box sx={{ position: "relative" }}>
        <MuiDatePicker
          label={label ?? "Date"}
          value={new Date(value)}
          onChange={(newValue) => onChange(newValue)}
          {...DatePickerProps}
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
            onChange(subDays(value, 1));
          }}
        >
          <Icons.RemoveRoundedIcon />
        </IconButtonStyled>

        <IconButtonStyled
          size="xs"
          onClick={() => {
            onChange(addDays(value, 1));
          }}
        >
          <Icons.Add />
        </IconButtonStyled>
      </Stack>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
