import { Icons } from "@/components/icons";
import useSearchAccounts from "./useSearchAccounts";
import { AccountType } from "@/zod-schemas/accounts/account-schema";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { FindAccountsQueryType } from "@/zod-schemas/accounts/find-accounts-schema";
import { numberWithCommas } from "@/utils/currency-formatter";
import { Ref, useImperativeHandle } from "react";

const defaultValue = {
  _id: "",
  account_name: "",
  account_type: "asset",
} as AccountType;

type Props<T> = {
  error?: string;
  onChange: (value: T) => void;
  value?: T;
  query?: Partial<FindAccountsQueryType>;
  label?: string;
  ref?: Ref<{ refetch: () => void }>;
  disabled?: boolean;
};
export const SearchAccounts = ({
  error,
  onChange,
  value,
  query,
  label = "Account",
  ref,
  disabled = false,
}: Props<AccountType>) => {
  const { options, handleInputChange, isLoading, refetch } = useSearchAccounts({
    ...query,
  });

  useImperativeHandle(ref, () => {
    return {
      refetch,
    };
  }, [refetch]);

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
      getOptionLabel={({ account_name }) => account_name}
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
            >
              {selected ? (
                <Icons.DoneAllIcon />
              ) : option.is_system_account ? (
                <Icons.LockIcon />
              ) : (
                <Icons.LockOpenIcon />
              )}
            </Avatar>
            <div>
              <Typography variant="subtitle2" color="primary">
                {option.account_name}{" "}
              </Typography>
              <Typography>
                {option.account_type}
                {query?.have_balance == "yes" ? (
                  <span>
                    | <strong>{numberWithCommas(option.balance)}</strong>
                  </span>
                ) : null}
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
          slotProps={{
            input: {
              ...params.InputProps,
              type: "search",
            },
          }}
        />
      )}
    />
  );
};
