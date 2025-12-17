"use client";
import { useGetCustomerStatementQuery } from "@/services/customers";
import {
  CustomerChartQueryType,
  CustomerStatementQueryType,
} from "@/types/customer";
import { formatCashKBM, numberWithCommas } from "@/utils/currency-formatter";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { last1year } from "@/utils/date-ranges";

export function useCustomerBalanceChart() {
  const { id } = useParams();

  const [queryState, setQuery] = useState<Partial<CustomerStatementQueryType>>({
    expand: "no",
    limit: 5000,
    ...last1year,
  });

  const { data, isFetching, refetch } = useGetCustomerStatementQuery({
    query: queryState,
    id: id as string,
  });
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    series: [
      {
        name: "Balance",
        data:
          data?.data.transactions?.map((item) => item.running_balance) || [],
      },
    ],
    chart: {
      type: "area",
      height: 250,
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data?.data.transactions?.map((item) => {
        const date = format(item.date_formatted, "MMM-yy");
        return date;
      }),
      tickAmount: 20,
      labels: {
        showDuplicates: false,
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
