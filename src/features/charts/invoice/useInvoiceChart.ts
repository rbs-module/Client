"use client";
import { useGetInvoiceChartQuery } from "@/services/invoice";
import { useFetchMyOrganizationQuery } from "@/services/organization";
import { ChatDataQuery } from "@/types/global";
import { formatCashKBM, numberWithCommas } from "@/utils/currency-formatter";
import { ApexOptions } from "apexcharts";
import { endOfDay } from "date-fns";
import { useEffect, useState } from "react";
const defaultQuery: ChatDataQuery = {
  end_date: endOfDay(new Date()).toISOString(),
  start_date: "2022",
  group_by: "month",
};
export function useInvoiceChart(query?: Partial<ChatDataQuery>) {
  const { data: org } = useFetchMyOrganizationQuery(null);
  const [queryState, setQuery] = useState<ChatDataQuery>({
    ...defaultQuery,
    start_date: org?.createdAt,
    ...query,
  });

  useEffect(() => {
    setQuery((p) => ({ ...p, ...query }));
  }, [query]);

  const { data, isFetching } = useGetInvoiceChartQuery(queryState);
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    series: [
      {
        name: "Amount",
        data: data?.map((item) => item.amount) || [],
      },
    ],
    // series: chartData?.map((item: any) => item.totalAmount) || [],
    chart: {
      type: "bar",
      height: 250,
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data?.map((item) => item.dateLabel || " "),
      floating: false,
      tickAmount: 20,
      labels: {
        formatter: (value = " - ") => {
          if (typeof value == "string" && value.indexOf("-") > -1) {
            return value?.split("-");
          }
          return String(value);
        },
        hideOverlappingLabels: true,
        style: { fontSize: "10px" },
        showDuplicates: false,
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

  const handleQueryChange = (query: Partial<ChatDataQuery>) => {
    setQuery((p) => ({ ...p, ...query }));
  };

  return {
    isLoading: isFetching,
    data,
    options,
    query: queryState,
    handleQueryChange,
  };
}
