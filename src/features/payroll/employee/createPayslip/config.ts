export const payrollConfig = {
  monthlySalaryDay: 30,
  WorkingHours: 12,
  getHourlyOTRate: (basic: number) => {
    return basic / 26 / 12;
  },
  getAbsenceDeduction: ({
    basic,
    absent_days,
  }: {
    basic: number;
    absent_days: number;
  }) => {
    return (basic / 30) * absent_days;
  },
};
