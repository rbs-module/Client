"use client";
import { ApexOptions } from "apexcharts";
import React from "react";

import dynamic from "next/dynamic";
import { useColorScheme } from "@mui/material";
import { Skeleton } from "@mui/material";
const DynamicApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  chartOptions?: ApexOptions;
  loading?: boolean;
}

const ChartComponent: React.FC<Props> = ({ chartOptions, loading }) => {
  const { mode, systemMode } = useColorScheme();

  const resolvedMode = (systemMode || mode) as "light" | "dark";

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      background: undefined,
      sparkline: {
        enabled: true,
      },
      height: 100,
    },
    tooltip: {
      y: {
        formatter: undefined,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },

    theme: {
      mode: resolvedMode,
      palette: "palette1",
      monochrome: {
        enabled: false,
        // color: "#255aee",
        // shadeTo: isDarkMode ? "dark" : 'light',
        shadeIntensity: 0.65,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    grid: {
      show: true,
      borderColor:
        resolvedMode == "light" ? "#E5E7EB" : "rgba(96 125 139 / 0.5)",
      strokeDashArray: 0.5,
    },
    ...chartOptions,
  };

  if (loading) {
    return (
      <Skeleton
        sx={{ bgcolor: "background.paper" }}
        height={Number(options.chart?.height) + 10}
      />
    );
  }

  return (
    <DynamicApexCharts
      width={"100%"}
      options={options}
      series={options.series}
      type={options?.chart?.type}
      height={options.chart?.height}
    />
  );
};

export default ChartComponent;
