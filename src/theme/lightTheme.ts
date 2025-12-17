import { createTheme } from "@mui/material";
import { shadows, shape, typography } from "./themePrimitives";
import { components } from "./components";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    ...components,
  },
  typography,
  shadows,
  shape,
});
