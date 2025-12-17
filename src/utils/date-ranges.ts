import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
  subYears,
  startOfYesterday,
  endOfYesterday,
} from "date-fns";

const df = "yyyy-MM-dd"; // Date format

const todayRange = {
  start_date: format(new Date(), df),
  end_date: format(new Date(), df),
  label: "Today",
};
const yesterdayRange = {
  start_date: format(startOfYesterday(), df),
  end_date: format(endOfYesterday(), df),
  label: "Yesterday",
};

const thisWeekRange = {
  start_date: format(
    subDays(startOfWeek(new Date(), { weekStartsOn: 0 }), 1),
    df,
  ),
  end_date: format(subDays(endOfWeek(new Date(), { weekStartsOn: 0 }), 1), df),
  label: "This Week",
};

const thisMonthRange = {
  start_date: format(startOfMonth(new Date()), df),
  end_date: format(endOfMonth(new Date()), df),
  label: "This Month",
};

const thisYearRange = {
  start_date: format(startOfYear(new Date()), df),
  end_date: format(new Date(), df),
  label: "This Year",
};

const prevMonthRange = {
  start_date: format(startOfMonth(subMonths(new Date(), 1)), df),
  end_date: format(endOfMonth(subMonths(new Date(), 1)), df),
  label: "Prev Month",
};

const prevYearRange = {
  start_date: format(startOfYear(subYears(new Date(), 1)), df),
  end_date: format(endOfYear(subYears(new Date(), 1)), df),
  label: "Prev Year",
};
const last30days = {
  start_date: format(subDays(new Date(), 30), df),
  end_date: format(new Date(), df),
  label: "Last 30 Days",
};
const last1year = {
  start_date: format(subYears(new Date(), 1), df),
  end_date: format(new Date(), df),
  label: "Last 1 Years",
};

export {
  todayRange,
  yesterdayRange,
  thisWeekRange,
  thisMonthRange,
  thisYearRange,
  prevMonthRange,
  prevYearRange,
  last30days,
  last1year,
};
