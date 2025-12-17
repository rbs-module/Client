import { createTheme } from "@mui/material";

import { colorSchemes, shadows, shape, typography } from "./themePrimitives";
import { components } from "./components";

const theme = createTheme({
  colorSchemes,
  components: {
    ...components,
  },
  typography,
  shadows,
  shape,
});

export default theme;
