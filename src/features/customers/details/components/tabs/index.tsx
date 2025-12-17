import Tabs from "@/components/Tabs";
import React from "react";
import Details from "./details";
import CustomerStatement from "./statement";
import Envelope from "./envelope";

function CustomerDetailsTab() {
  return (
    <Tabs
      tabs={[
        {
          component: <Details />,
          isDisabled: false,
          title: "Details",
        },
        {
          component: <CustomerStatement />,
          isDisabled: false,
          title: "Statement",
        },
        {
          component: <Envelope />,
          isDisabled: false,
          title: "Envelope ",
        },
      ]}
    />
  );
}

export default CustomerDetailsTab;
