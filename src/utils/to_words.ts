import { ToWords } from "to-words";

const toWordsFn = new ToWords({
  localeCode: "en-BD",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

export const toWords = (value: number) => {
  return toWordsFn.convert(+value || 0);
};
