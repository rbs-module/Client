"use client";

import { InputAdornment, TextField } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useState } from "react";
import { useDebounce } from "react-use";

type Props = {
  onChange: (text: string) => void;
  value?: string;
};
function SearchBar({ onChange, value = "" }: Props) {
  const [searchText, setSearchText] = useState(value);

  useDebounce(
    () => {
      onChange(searchText);
    },
    500,
    [searchText]
  );
  return (
    <TextField
      autoFocus
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
      color="info"
      fullWidth={false}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <GridSearchIcon />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        ".MuiInputBase-input": {
          padding: "5px",
        },
      }}
      size="small"
      placeholder="Search..."
      type="search"
    />
  );
}

export { SearchBar };
