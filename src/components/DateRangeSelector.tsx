import IconButtonStyled from "@/components/styled/IconButton";
import { useMenu } from "@/hooks/useMenu";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  last1year,
  last30days,
  prevMonthRange,
  prevYearRange,
  thisMonthRange,
  thisWeekRange,
  thisYearRange,
  todayRange,
  yesterdayRange,
} from "@/utils/date-ranges";
import { DateCalendar } from "@mui/x-date-pickers";
import { useState } from "react";
import { format } from "date-fns";
import { Icons } from "@/components/icons";

let defaultRanges = [
  todayRange,
  yesterdayRange,
  thisWeekRange,
  thisMonthRange,
  thisYearRange,
  prevMonthRange,
  prevYearRange,
  last30days,
  last1year,
];

export type DateRangeType = (typeof defaultRanges)[number];

function DateRangeSelector({
  ranges,
  selected,
  start_date = thisMonthRange.start_date,
  end_date = thisMonthRange.end_date,
  onChange,
  showLabel = true,
}: {
  selected: string;
  start_date?: string;
  end_date?: string;
  onChange: (value: (typeof defaultRanges)[number]) => void;
  showLabel?: boolean;
  ranges?: DateRangeType[];
}) {
  if (ranges?.length) {
    defaultRanges = ranges;
  }
  const { anchorEl, handleClose, handleOpen, open } = useMenu();
  const {
    handleClose: handleCloseCUstomMenu,
    handleOpen: handleOpenCustomMenu,
    open: openCustomMenu,
  } = useMenu();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenRangeDialog = (e: any) => {
    handleOpenCustomMenu(e);
    handleClose();
  };

  const [customDate, setCustomDate] = useState({
    start_date: start_date,
    end_date: end_date,
  });

  const handleStartDate = (value: string) => {
    const key = "start_date";
    setCustomDate((p) => ({ ...p, [key]: value }));
  };
  const handleEndDate = (value: string) => {
    const key = "end_date";
    setCustomDate((p) => ({ ...p, [key]: value }));
  };

  return (
    <Box>
      {selected.toLowerCase() == "custom" || !showLabel ? (
        <Tooltip title="Select Date Range">
          <IconButtonStyled size="xs" onClick={handleOpen}>
            <Icons.DateRangeIcon />
          </IconButtonStyled>
        </Tooltip>
      ) : (
        <Button
          size="small"
          endIcon={<Icons.ExpandMoreIcon />}
          onClick={handleOpen}
        >
          {selected}
        </Button>
      )}
      <Menu
        sx={{ padding: 0 }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {defaultRanges.map((item) => (
          <MenuItem
            onClick={() => {
              onChange(item);
              handleClose();
            }}
            selected={
              selected == (item.label || item.end_date || item.start_date)
            }
            key={item.label}
          >
            <ListItemText> {item.label}</ListItemText>

            <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
              {selected == item.label ? <Icons.DoneAllIcon /> : " "}
            </Typography>
          </MenuItem>
        ))}
        <MenuItem
          selected={selected.toLowerCase() == "custom"}
          onClick={handleOpenRangeDialog}
        >
          <ListItemText>Custom</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary", ml: 3 }}>
            {selected.toLowerCase() == "custom" ? <Icons.DoneAllIcon /> : " "}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={openCustomMenu}
        onClose={handleCloseCUstomMenu}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle sx={{ minWidth: 300 }} id="alert-dialog-title">
          {"Select Date Range"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} direction={"row"}>
            <DateCalendar
              maxDate={new Date()}
              minDate={new Date("2020")}
              onChange={handleStartDate}
              value={new Date(customDate.start_date || "")}
            />
            <Divider
              orientation="vertical"
              sx={{ borderRight: "1px solid red" }}
            />
            <DateCalendar
              // maxDate={new Date()}
              minDate={new Date("2020")}
              onChange={handleEndDate}
              value={new Date(customDate.end_date || "")}
            />
          </Stack>
        </DialogContent>
        <Typography variant="caption" sx={{ textAlign: "right", mr: 2 }}>
          From{" "}
          <strong>{format(customDate.start_date || "", "dd-MM-yyyy")}</strong>{" "}
          to <strong> {format(customDate.end_date || "", "dd-MM-yyyy")}</strong>
        </Typography>
        <DialogActions>
          <Button color="error" onClick={handleCloseCUstomMenu}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onChange({
                label: "Custom",
                start_date: format(customDate.start_date || "", "yyyy-MM-dd"),
                end_date: format(customDate.end_date || "", "yyyy-MM-dd"),
              });
              handleCloseCUstomMenu();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DateRangeSelector;
//  <DateRangePicker defaultValue={[dayjs("2022-04-17"), dayjs("2022-04-21")]} />;
