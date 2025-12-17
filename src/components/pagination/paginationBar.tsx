import { Pagination } from "@/types/pagination";
import initialPagination from "@/utils/initial-pagination";

import { TablePagination } from "@mui/material";

function PaginationBar({
  pagination = initialPagination,
  onPageChange = () => {},
  onLimitChange = () => {},
}: {
  pagination?: Pagination;
  onPageChange?: ({ page }: { page: number }) => void;
  onLimitChange?: ({ limit }: { limit: number }) => void;
}) {
  return (
    <TablePagination
      size="small"
      sx={{
        padding: 0,
        "& .MuiInputBase-root": {
          width: "auto",
        },
        "& .MuiToolbar-root": {
          minHeight: 38,
        },
      }}
      rowsPerPageOptions={[10, 20, 50, 100, 1000]}
      count={pagination.totalDocuments}
      component={"div"}
      onPageChange={(_e, page) => onPageChange({ page: page + 1 })}
      onRowsPerPageChange={(e) =>
        onLimitChange({ limit: Number(e.target.value) })
      }
      page={pagination.currentPage - 1}
      showFirstButton
      showLastButton
      rowsPerPage={pagination.limit}
      variant="footer"
      width={111}
    />
  );
}

export { PaginationBar };
