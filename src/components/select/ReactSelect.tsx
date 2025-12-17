import { CircularProgress, FormHelperText } from "@mui/material";
import { useCallback } from "react";
import Select from "react-select";
import { twMerge } from "tailwind-merge";

export type AsyncOption<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly label: string | any;
  readonly value: T;
};

type Props<T> = {
  options: AsyncOption<T>[];
  searchTerm?: string;
  isLoading?: boolean;
  error?: string;
  value?: T;
  handleInputChange: (text: string) => void;
  handleSelect: (text: T) => void;
  isDisabled?: boolean;
};

function ReactSelect<T>({
  options = [],
  error,
  handleInputChange,
  isLoading,
  handleSelect,
  value,
  isDisabled,
}: Props<T>) {
  const debounceFN = (fn: (...args: unknown[]) => void, delay = 500) => {
    let timeout: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleInputChanges = useCallback(
    (value: string) => {
      debounceFN(() => {
        handleInputChange(value);
      }, 300)();
    },
    [handleInputChange],
  );

  return (
    <>
      <Select
        isDisabled={isDisabled}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options={options as any}
        onInputChange={handleInputChanges}
        escapeClearsValue
        filterOption={() => true}
        isLoading={Boolean(isLoading)}
        loadingMessage={() => <CircularProgress size={20} />}
        maxMenuHeight={500}
        isClearable
        noOptionsMessage={() => "No orders found"}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(p: any) => handleSelect(p?.value)}
        value={value}
        classNames={{
          input: () => `[&_input:focus]:ring-0 `,
          control: (state) =>
            twMerge(`
              ${Boolean(error) ? "ring-2 ring-red-600/50 focus:ring-red-600/50 w-full" : ""}
                ${!state.isFocused ? "" : ""} 
                rounded-md flex   border-gray-500 h-9 `),
          container: () => "",
          menuList: () => `scroll-box !z-50 !max-h-[250px] text-gray-800`,

          dropdownIndicator: ({ isFocused }) =>
            `${isFocused ? "rotate-180" : "rotate-0"} duration-300`,
        }}
        styles={{
          control: () => ({
            boxSizing: "unset",
            width: "100%",
            backgroundColor: "transparent",
            // outline: state.isFocused ? "4px solid #b1ecf3e6" : "none",
            outlineOffset: "1px",
          }),
        }}
      />
      <FormHelperText sx={{ color: "red" }}>{error}</FormHelperText>
    </>
  );
}

export default ReactSelect;
