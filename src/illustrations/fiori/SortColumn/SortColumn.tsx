import { createIllustration } from "../../createIllustration";

export const SortColumn = createIllustration({
  name: "SortColumn",
  title: "Not seeing the most important items first?",
  subtitle: "Choose the sort criteria in the sort settings.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SortColumn;
