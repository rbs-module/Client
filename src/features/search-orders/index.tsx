import { FormattedOrder } from "@/types/order";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { Icons } from "@/components/icons";
import useSearchOrder from "./useSearchOrder";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";

const defaultValue = {
  _id: "",
  order_name: "",
  sl_no: "",
} as FormattedOrder;

type Props<T> = {
  error?: string;
  onChange: (value: T) => void;
  value?: T;
  label?: string;
  isDisabled?: boolean;
};
export const SearchOrders = ({
  error,
  onChange,
  value,
  label = "",
  isDisabled,
}: Props<FormattedOrder>) => {
  const { options, handleInputChange, isLoading, searchTerm } =
    useSearchOrder();

  return (
    <Autocomplete
      disabled={isDisabled}
      clearOnEscape
      loading={isLoading}
      value={value ?? defaultValue}
      filterOptions={() => options}
      options={options}
      onChange={(_e, op) => (op ? onChange(op) : {})}
      isOptionEqualToValue={(option) => option._id == value?._id}
      getOptionKey={({ _id }) => _id}
      getOptionLabel={({ order_name, sl_no }) => `${sl_no} ${order_name}`}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const selected = props["aria-selected"];
        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{ gap: 3, paddingY: "15px", alignItems: "center" }}
          >
            <Avatar
              src={ImageUrlConfig(option.cover_photo, "w_50,h_50,r_max")}
              sx={{
                width: 50,
                height: 50,
                bgcolor: selected ? "primary.main" : undefined,
              }}
            />
            <div>
              <Typography fontWeight={"bold"} className="truncate">
                {option.sl_no} {option.order_name}
              </Typography>
              <Typography color="textSecondary" className="truncate">
                <Icons.PeopleAltIcon /> {option.customer.name}
              </Typography>
              <Typography
                className="truncate"
                fontSize={8}
                textAlign={"right"}
                color="textSecondary"
              >
                {option.status}
              </Typography>
            </div>
          </Box>
        );
      }}
      slotProps={{
        clearIndicator: {
          onClick: () => {
            onChange(defaultValue);
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          value={searchTerm}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          error={Boolean(error)}
          helperText={error}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: value?.cover_photo ? (
                <Avatar
                  src={ImageUrlConfig(value.cover_photo, "w_30,h_30,r_max")}
                  sx={{
                    width: 30,
                    height: 30,
                  }}
                />
              ) : (
                ""
              ),
            },
          }}
        />
      )}
    />
  );
};
