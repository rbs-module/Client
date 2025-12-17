import { Typography } from "@mui/material";

type Props = {
  title?: string;
  subTitle?: string;
};
export const NoData = ({
  title = "There are no data available",
  subTitle = "select an item to show",
}: Props) => {
  return (
    <div className="text-center my-14 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 817.47 817.47"
        className="w-40 h-40 mx-auto mb-5 bg-base-light-primary rounded-full"
      >
        <path
          fill="#e4eaed"
          d="M408.74 0C183 0 0 183 0 408.74s183 408.73 408.74 408.73 408.73-183 408.73-408.73S634.47 0 408.74 0zm264.43 588.35a37.41 37.41 0 01-37.41 37.41H276.53a37.41 37.41 0 01-37.41-37.41V268.63H164.3v-39.5a37.41 37.41 0 0137.41-37.41h359.23a37.41 37.41 0 0137.41 37.4v319.79h74.82z"
        ></path>
        <path
          fill="#708da0"
          d="M281.66 625.4a37.41 37.41 0 0032.28-37v-39.49h284.41V229.12a37.41 37.41 0 00-37.41-37.4H201.71a37.41 37.41 0 0137.41 37.41v359.21a37.41 37.41 0 0037.41 37.41h5.13zm130.75-180.93l-86.41-.09a7.5 7.5 0 010-15l86.36.09a7.5 7.5 0 010 15zm85.36-72.88l-171.65-.16a7.5 7.5 0 010-15l171.64.16a7.5 7.5 0 110 15zm.07-73l-171.65-.16a7.5 7.5 0 010-15l171.64.16a7.5 7.5 0 110 15z"
        ></path>
      </svg>
      <Typography variant="body1">{title}</Typography>
      <Typography variant="body2">{subTitle}</Typography>
    </div>
  );
};
