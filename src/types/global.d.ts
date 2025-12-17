import React from "react";

export type LayoutProps = {
  children: React.ReactNode;
};

export type ChatDataQuery = {
  end_date?: string;
  start_date?: string;
  group_by?: "day" | "month" | "year";
  label?: string;
};

export type ChartDataType = {
  dateLabel: string;
  amount: number;
};
