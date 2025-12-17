import { Pagination } from "@/types/pagination";
import initialPagination from "@/utils/initial-pagination";

import { Box, Tooltip } from "@mui/material";
import { Icons } from "@/components/icons";
import IconButtonStyled from "../styled/IconButton";

function PaginationBarMini({
  pagination = initialPagination,
  onPageChange = () => {},
}: {
  pagination?: Pagination;
  onPageChange?: ({ page }: { page: number }) => void;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 6,
        right: 10,
        zIndex: 5,
        display: "flex",
        gap: 0.5,
        p: 0.5,
        px: 2,
        borderRadius: 2,
        alignItems: "center",
        backdropFilter: "blur(2px)",
        opacity: 0.2,
        transition: "all 0.5s",
        ":hover": {
          opacity: 1,
        },
      }}
    >
      <Tooltip
        title={pagination.prevPage !== null ? "Prev Page" : undefined}
        arrow
      >
        <span>
          <IconButtonStyled
            onClick={() => {
              onPageChange({ page: pagination.prevPage || 1 });
            }}
            disabled={pagination.prevPage === null}
            sx={{
              boxShadow: 0,
            }}
            size="xs"
          >
            <Icons.ArrowBackIosNewIcon />
          </IconButtonStyled>
        </span>
      </Tooltip>

      <div className="w-6 h-6 rounded-full flex items-center justify-center">
        <strong>{pagination.currentPage}</strong>
      </div>

      <Tooltip
        title={pagination.nextPage !== null ? "Next Page" : undefined}
        arrow
      >
        <span>
          <IconButtonStyled
            onClick={() => {
              onPageChange({ page: pagination.nextPage || 1 });
            }}
            disabled={pagination.nextPage === null}
            sx={{
              boxShadow: 0,
            }}
            size="xs"
          >
            <Icons.ArrowForwardIosIcon />
          </IconButtonStyled>
        </span>
      </Tooltip>
    </Box>
  );
}

export { PaginationBarMini };
