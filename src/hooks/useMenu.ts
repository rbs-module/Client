import * as React from "react";

export const useMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return { open, handleClose, handleOpen, anchorEl };
};

export const useNamedMenu = <T extends string>({ name }: { name: T }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    [`${name}Open`]: open,
    [`handle${name}MenuOpen`]: handleOpen,
    [`handle${name}MenuClose`]: handleClose,
    [`${name}AnchorEl`]: anchorEl,
  } as Record<
    `${T}Open` | `handle${T}MenuOpen` | `handle${T}MenuClose` | `${T}AnchorEl`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >;
};
