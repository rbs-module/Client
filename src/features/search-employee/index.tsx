import useSearchEmployee from "./useSearchEmployee";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { Employee, FindEmployeeQuery } from "@/types/payroll";

const defaultValue = {
  _id: "",
  name: "",
} as Employee;

type Props<T> = {
  error?: string;
  onChange: (value: T) => void;
  value?: T;
  query?: Partial<FindEmployeeQuery>;
  label?: string;
  disabled?: boolean;
};
export const SearchEmployee = ({
  error,
  onChange,
  value,
  query,
  label = "Account",
  disabled,
}: Props<Employee>) => {
  const { options, handleInputChange, isLoading } = useSearchEmployee({
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
              src={option.image}
            />
            <div>
              <Typography variant="subtitle1" color="primary">
                {option.name}{" "}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {option.id_no}{" "}
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
        />
      )}
    />
  );
};
