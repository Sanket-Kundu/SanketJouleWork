import { createIllustration } from "../../createIllustration";

export const ResizeColumn = createIllustration({
  name: "ResizeColumn",
  title: "Choose your own column width",
  subtitle: "You can resize columns by dragging the column borders.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ResizeColumn;
