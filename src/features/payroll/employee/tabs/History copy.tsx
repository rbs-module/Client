import {
  VerticalTimeline,
  VerticalTimelineElement,
  VerticalTimelineElementProps,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import React from "react";
import { Icons } from "@/components/icons";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  Container,
  Divider,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import IconButtonStyled from "@/components/styled/IconButton";
import { useGetEmployeeHistoryQuery } from "@/store/payroll";
import { EmployeeHistoryType } from "@/types/payroll";

type Props = VerticalTimelineElementProps & {
  color?: string;
  background?: string;
};
const Item = ({ background = "#fff", color, ...rest }: Props) => (
  <VerticalTimelineElement
    className="vertical-timeline-element--work"
    contentArrowStyle={{ borderRight: `7px solid  ${background}` }}
    dateClassName="mx-2"
    iconClassName={`bg-white`}
    icon={<Icons.Add />}
    {...rest}
    iconStyle={{
      background,
      color,
      borderWidth: 4,
      borderColor: color,
      ...rest.iconStyle,
    }}
  />
);

const getIcon = (action: EmployeeHistoryType["action"]) => {
  if (action == "updated") {
    return <Icons.EditIcon />;
  }
  if (action == "created") {
    return <Icons.Add />;
  }
  if (action == "comments") {
    return <Icons.CommentIcon />;
  }
  if (action == "payslip_created") {
    return <Icons.RequestPageIcon />;
  }
  if (action == "salary_advance") {
    return <Icons.InsightsIcon />;
  }
  return <Icons.ReportProblemIcon />;
};
const getIconStyle = (action: EmployeeHistoryType["action"]) => {
  if (action == "created") {
    return {
      background: "rgb(16, 204, 82)",
      color: "white",
    };
  }

  return {};
};

export function EmployeeHistory() {
  const params = useParams();
  const id = params.id as string;

  const { data, isFetching, refetch } = useGetEmployeeHistoryQuery({
    id,
    query: { page: 1, limit: 1000, sort_type: "desc" },
  });
  const theme = useTheme();
  const demoData = Array(200).fill("_");
  return (
    <Container maxWidth="md">
      <style>{`
      .vertical-timeline-element-content { 
        padding: 0 !important;
        background-color: transparent;
      };
    `}</style>
      <IconButtonStyled
        onClick={refetch}
        sx={{ position: "fixed", right: 20, top: 160 }}
      >
        <Icons.RefreshIcon />
      </IconButtonStyled>
      <VerticalTimeline lineColor={theme.palette.divider}>
        {isFetching ? (
          <Box>
            {demoData.map((_, i) => (
              <Item key={i}>
                <Skeleton height={30} />
                <Skeleton height={100} />
              </Item>
            ))}
          </Box>
        ) : (
          data?.history.map((history) => (
            <Item
              date={format(String(history.createdAt), "dd-MMM-yyyy @hh:mm a")}
              key={history._id}
              color={theme.palette.text.secondary}
              background={theme.palette.background.paper}
              contentStyle={{
                borderTop: "3px solid red",
                boxShadow: theme.shadows[1],
              }}
              icon={getIcon(history.action)}
              iconStyle={{
                ...getIconStyle(history.action),
              }}
              style={{ padding: 0 }}
            >
              <Box
                component={Card}
                p={1}
                px={2}
                sx={{ border: 0.5, borderColor: "divider" }}
              >
                <Typography fontSize={9} className="!m-0">
                  {" "}
                  {history.action}
                </Typography>
                <Divider />
                {history.changes.map((item, i) => (
                  <Typography
                    variant="inherit"
                    className=" !text-xs"
                    key={item.field + i}
                  >
                    {i + 1}-{" "}
                    <span className="uppercase text-xs">{item.field}</span> :{" "}
                    <span className="opacity-50">`{item.oldValue}`</span> to{" "}
                    <strong>`{String(item.newValue)}`</strong>
                  </Typography>
                ))}
                <Typography color="info"> {history.message}</Typography>

                <Divider />
                <p className="!text-xs">By: {history.modified_by?.name}</p>
              </Box>
            </Item>
          ))
        )}
      </VerticalTimeline>
    </Container>
  );
}
