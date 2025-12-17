import {
  useGetEmployeeByIdQuery,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/store/payroll";
import { usePayrollStore } from "@/store/payroll/hooks";
import { Employee } from "@/types/payroll";
import { numberWithCommas } from "@/utils/currency-formatter";
import { ImageUrlConfig } from "@/utils/imageUrlConfig";
import getRelativeTime from "@/utils/relativeTime";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function EmployeeCard() {
  const activePage = useParams();
  const id = activePage.id as string;
  const { data: employee, refetch: refetchEmployee } =
    useGetEmployeeByIdQuery(id);

  const { findEmployeeQuery } = usePayrollStore();
  const { refetch } = useGetEmployeeQuery(findEmployeeQuery);
  const [updateEmployee] = useUpdateEmployeeMutation();

  const handleUpdateEmployee = async (body: Partial<Employee>) => {
    const res = await updateEmployee({ body, id: employee?._id || "" });
    if (res.data) {
      refetch();
      refetchEmployee();
      toast.success(res.data.message);
    }
  };

  const data = [
    {
      key: "Joining Date",
      value: employee?.joining_date
        ? format(employee?.joining_date, "dd-MMM-yyyy") +
          `(${getRelativeTime(employee.joining_date)})`
        : "",
    },
    {
      key: "Department",
      value: employee?.department,
    },
    {
      key: "Salary",
      value: numberWithCommas(employee?.salary, 0),
    },
    {
      key: "Email",
      value: employee?.email,
    },
    {
      key: "Phone",
      value: employee?.phone,
    },
  ];

  return (
    <Card sx={{ m: 2, maxWidth: 350 }}>
      <CardContent>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            boxShadow: 2,
            p: 0.5,
            mx: "auto",
            mb: 2,
          }}
          src={ImageUrlConfig(employee?.image || "", "w_100,h_100,r_max")}
        />

        <Typography sx={{ fontWeight: 700, fontSize: 14, textAlign: "center" }}>
          {employee?.name}
        </Typography>
        <Typography sx={{ textAlign: "center" }}>{employee?.id_no}</Typography>
        <Typography sx={{ textAlign: "center" }}>
          {employee?.designation}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <table>
          <tbody>
            {data.map(({ key, value }, i) => (
              <tr key={i}>
                <td>{key}</td>
                <td>
                  : <b>{value}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <Divider />
      <CardActions>
        {employee?.is_active ? (
          <Button
            onClick={() => {
              handleUpdateEmployee({ is_active: false });
            }}
            color="error"
            variant="outlined"
          >
            Out
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleUpdateEmployee({ is_active: true });
            }}
            color="info"
            variant="outlined"
          >
            Activate
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default EmployeeCard;
