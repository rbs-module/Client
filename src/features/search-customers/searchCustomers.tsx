"use client";
import { SearchedCustomer } from "@/types/customer";

import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import React from "react";

import useSearchCustomers from "./useSearchCustomers";
import { Icons } from "@/components/icons";
import { numberWithCommas } from "@/utils/currency-formatter";
type Props = {
  value?: SearchedCustomer;
  setValue: (value: SearchedCustomer | null) => void;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps?: Partial<AutocompleteProps<any, any, any, any, any>>;
};
const SearchCustomer = ({ value, setValue, error, inputProps }: Props) => {
  const { data, inputRef, isLoading, setSearchText } = useSearchCustomers();
  return (
    <Autocomplete
      {...inputProps}
      clearOnEscape
      value={value}
      onChange={(_e, value) => setValue(value)}
      size="small"
      options={data || []}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      loading={isLoading}
      onInputChange={(_e, value) => setSearchText(value)}
      getOptionKey={({ _id }) => `${_id}`}
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
              {selected ? <Icons.DoneAllIcon /> : <Icons.PersonIcon />}
            </Avatar>
            <Box>
              <p> {option.name}</p>
              <p> {numberWithCommas(option.balance)}</p>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          inputRef={inputRef}
          onClick={() => {
            inputRef.current?.select();
          }}
          {...params}
          label="Select Customer"
          error={Boolean(error)}
          helperText={error}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};
export default SearchCustomer;
