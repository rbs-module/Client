import { Chip } from "@mui/material";
import { Icons } from "@/components/icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusConfig: any = {
  Placed: { color: "error", icon: <Icons.QueryBuilderIcon /> },
  Pending: { color: "warning", icon: <Icons.QueryBuilderIcon /> },
  Processing: {
    color: "info",
    icon: <Icons.DirectionsRunIcon />,
  },
  Completed: { color: "success", icon: <Icons.TaskAltIcon /> },
  Invoiced: { color: "success", icon: <Icons.RequestPageIcon /> },
  Shipped: { color: "success", icon: <Icons.LocalShippingIcon /> },
  Default: { color: "success", icon: <Icons.ReportProblemIcon /> },
};

const OrderStatusChip = ({ value }: { value: string }) => {
  const { color, icon } = statusConfig[value] || statusConfig.Default;

  return (
    <Chip
      sx={{ minWidth: 80 }}
      label={value}
      color={color}
      size="small"
      icon={icon}
    />
  );
};

export default OrderStatusChip;
