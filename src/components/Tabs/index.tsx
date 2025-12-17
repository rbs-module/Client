"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { tabsClasses } from "@mui/material/Tabs";
import MuiTabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import SimpleBar from "simplebar-react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          component={SimpleBar}
          sx={{
            height: `calc(100vh - 150px)`,
            // px: 3,
            // bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

type Props = {
  tabs: {
    title: string;
    component: React.ReactNode;
    isDisabled: boolean;
  }[];
};
export default function Tabs({ tabs = [] }: Props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        border: 1,
        borderTop: 0,
        borderColor: "divider",
      }}
    >
      <MuiTabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.title} label={tab.title} />
        ))}
      </MuiTabs>
      {tabs.map((tab, i) => (
        <CustomTabPanel key={tab.title + i} value={value} index={i}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
