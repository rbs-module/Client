"use client";
import { formatCashKBM, numberWithCommas } from "@/utils/currency-formatter";
import { ApexOptions } from "apexcharts";
import useExpenseByCategory from "@/features/expenses/by-category/useExpenseByCategory";

export function useExpenseByCategoryChart() {
  const {
    data = [],
    refetch,
    handleQueryChange,
    query,
    isLoading,
  } = useExpenseByCategory();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    series: [
      {
        name: "Balance",
        data: data?.map((item) => item.amount) || [],
      },
    ],
    chart: {
      type: "bar",
      height: 250,
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data?.map((item) => item.account_name),
      tickAmount: 20,
      labels: {
        showDuplicates: false,
        style: { fontSize: "10px" },
        rotate: -45,
        formatter: function (value) {
          return value.length > 10 ? value.substring(0, 10) + "..." : value;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCashKBM(value) as string,
        style: { fontSize: "10px" },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        dataLabels: {
          position: "top", // top, center, bottom
        },
        columnWidth: "80%",
        barHeight: "100%",
        horizontal: false,
        distributed: false,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return formatCashKBM(+val) as string;
      },
      offsetY: -20,
      style: {
        fontSize: "8px",
        colors: undefined,
        fontFamily: "roboto",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return numberWithCommas(val);
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
  };

  return {
    isLoading: Boolean(isLoading && data?.length == 0),
    options,
    refetch,
    handleQueryChange,
    query,
  };
}
