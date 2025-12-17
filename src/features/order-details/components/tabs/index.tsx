"use client";

import Tabs from "@/components/Tabs";
import Details from "./details";
import OrderHistory from "./history";
import ChatComponent from "./comments";
import OrderInvoice from "./invoice";
import useOrderDetails from "../../hooks/useOrderDetails";
import OrderProductions from "./productions";
import OrderGoodsInout from "./in-out";
import Gallery from "./gallery";

function OrderDetailsTab() {
  const { order, orderId } = useOrderDetails();
  return (
    <Tabs
      tabs={[
        {
          component: <Details />,
          isDisabled: false,
          title: "Details",
        },
        {
          component: <OrderHistory />,
          isDisabled: false,
          title: "History",
        },
        {
          component: <ChatComponent />,
          isDisabled: false,
          title: "Comments",
        },
        {
          component: <OrderGoodsInout orderId={orderId} />,
          isDisabled: false,
          title: "In Out",
        },
        {
          component: <OrderProductions orderId={orderId} />,
          isDisabled: false,
          title: "Productions",
        },
        {
          component: <Gallery orderId={orderId} />,
          isDisabled: false,
          title: "Gallery",
        },
        {
          component: <OrderInvoice id={orderId} />,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isDisabled: !Boolean((order as any)?.properties?.invoice_id),
          title: "Invoice",
        },
      ]}
    />
  );
}
export default OrderDetailsTab;
