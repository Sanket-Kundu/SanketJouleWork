import { createIllustration } from "../../createIllustration";

export const FilterTable = createIllustration({
  name: "FilterTable",
  title: "Filter options are available",
  subtitle: "Filters help you focus on what\'s most relevant for you.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default FilterTable;
