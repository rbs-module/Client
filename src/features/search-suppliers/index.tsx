import useSearchSuppliers from "./useSearchSuppliers";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import type { DefaultQueryParamsDTOType } from "@/zod-schemas/default-query-paramsDTO";
import { SupplierType } from "@/types/customer";
const defaultValue = {
  _id: "",
  name: "",
} as SupplierType;

type Props<T> = {
  error?: string;
  onChange: (value: T) => void;
  value?: T;
  query?: Partial<DefaultQueryParamsDTOType>;
  label?: string;
  disabled?: boolean;
};
export const SearchSuppliers = ({
  error,
  onChange,
  value,
  query,
  label = "Account",
  disabled,
}: Props<SupplierType>) => {
  const { options, handleInputChange, isLoading } = useSearchSuppliers({
    ...query,
  });

  return (
    <Autocomplete
      disabled={disabled}
      clearOnEscape
      loading={isLoading}
      value={value ?? defaultValue}
      options={options}
      onChange={(_e, op) => (op ? onChange(op) : {})}
      isOptionEqualToValue={(option) => option._id == value?._id}
      getOptionKey={({ _id }) => _id}
      getOptionLabel={({ name }) => name}
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
              sx={{
                width: 30,
                height: 30,
                bgcolor: selected ? "primary.main" : undefined,
              }}
            />
            <div>
              <Typography variant="subtitle2" color="primary">
                {option.name}{" "}
              </Typography>
            </div>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          error={Boolean(error)}
          helperText={error}
          // slotProps={{
          //   input: {
          //     ...params.InputProps,
          //     type: "search",
          //   },
          // }}
        />
      )}
    />
  );
};
