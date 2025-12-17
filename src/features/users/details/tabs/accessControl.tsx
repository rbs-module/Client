import { Icons } from "@/components/icons";
import DataTable from "@/components/Table";
import { useRoutesQuery } from "@/services/configs";
import {
  useGetAccessControlQuery,
  useGrantAccessMutation,
} from "@/services/user";
import { Box, Switch } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";

function AssignRoles() {
  const { id } = useParams(); // userId from route
  const userId = id as string;

  // ✅ Get all available routes
  const { data: routes } = useRoutesQuery(null);

  // ✅ Get current access control for this user
  const { data: accessControl } = useGetAccessControlQuery(userId);

  // ✅ Mutation for granting/revoking
  const [grantAccess, { isLoading: grantLoading }] = useGrantAccessMutation();

  const [localAccess, setLocalAccess] = React.useState(new Set<string>());

  React.useEffect(() => {
    if (accessControl?.accessLinks) {
      setLocalAccess(
        new Set(
          accessControl.accessLinks.filter((l) => l.access).map((l) => l.path),
        ),
      );
    }
  }, [accessControl]);

  const handleSwitch = (path: string, checked: boolean) => {
    setLocalAccess((prev) => {
      const newSet = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      checked ? newSet.add(path) : newSet.delete(path);
      return newSet;
    });

    // send update to API
    grantAccess({ userId, path, access: checked });
  };

  return (
    <Box>
      <DataTable
        defaultHeaderCellClass="!text-left"
        rowData={routes ?? []}
        colDef={[
          {
            field: "name",
            headerName: "Route Name",
            flex: 1,
          },
          { field: "path", headerName: "Path", flex: 1 },
          {
            field: "method",
            headerName: "Method",
            formatter: ({ value }) => `[${String(value).toUpperCase()}]`,
          },
          {
            field: "id",
            headerName: "Actions",
            headerCellClass: "!text-center",
            cellRenderer: ({ value, data }) => (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {!data?.access?.some((a) => a.includes("*")) ? (
                  <Switch
                    disabled={grantLoading}
                    checked={localAccess.has(String(value))}
                    onChange={(e) =>
                      handleSwitch(String(value), e.target.checked)
                    }
                    color="primary"
                    size="small"
                  />
                ) : (
                  <Icons.StarIcon color="primary" />
                )}
              </Box>
            ),
          },
        ]}
      />
    </Box>
  );
}

export default AssignRoles;
