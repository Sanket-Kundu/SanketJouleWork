import { createIllustration } from "../../createIllustration";

export const SortingColumns = createIllustration({
  name: "SortingColumns",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SortingColumns;
