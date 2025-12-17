"use client";

import Tabs from "@/components/Tabs";
import AssignRoles from "./accessControl";

function UserDetailsTab() {
  return (
    <Tabs
      tabs={[
        {
          component: <AssignRoles />,
          isDisabled: false,
          title: "Details",
        },
      ]}
    />
  );
}
export default UserDetailsTab;
