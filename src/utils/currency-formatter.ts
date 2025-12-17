export const numberWithCommas = (x: number = 0, p: number = 2) => {
  const d = x?.toFixed(p);
  if (!d) {
    return "undefined";
  }
  const string = d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return string == "NaN" ? "0.00" : string;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCashKBM = (n: number) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};
