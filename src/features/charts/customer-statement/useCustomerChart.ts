"use client";
import { useGetCustomerChartQuery } from "@/services/customers";
import { CustomerChartQueryType } from "@/types/customer";
import { formatCashKBM, numberWithCommas } from "@/utils/currency-formatter";
import { ApexOptions } from "apexcharts";
import { useParams } from "next/navigation";
import { useState } from "react";

const defaultQuery: Partial<CustomerChartQueryType> = {
  dateLabel: "custom",
  group_by: "month",
};
export function useCustomerChart(
  query: Partial<CustomerChartQueryType> = { dateLabel: "custom" },
) {
  const [queryState, setQuery] = useState<Partial<CustomerChartQueryType>>({
    ...defaultQuery,
    ...query,
  });
  const { id } = useParams();

  const { data, isFetching, refetch } = useGetCustomerChartQuery({
    query: queryState,
    id: id as string,
  });
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    series: [
      {
        name: "INVOICE",
        data: data?.chart?.map((item) => item.debit_amount) || [],
      },
      {
        name: "PAYMENT",
        data: data?.chart?.map((item) => item.credit_amount) || [],
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
      categories: data?.chart?.map((item) => item.dateLabel || " "),
      floating: false,
      tickAmount: 30,
      labels: {
        formatter: (value = " - ") => {
          if (typeof value == "string" && value.indexOf("-") > -1) {
            return value?.split("-");
          }
          return String(value);
        },

        style: { fontSize: "10px" },
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

  const handleQueryChange = (query: Partial<CustomerChartQueryType>) => {
    setQuery((p) => ({ ...p, ...query }));
  };

  return {
    isLoading: isFetching,
    data,
    options,
    query: queryState,
    refetch,
    handleQueryChange,
  };
}
