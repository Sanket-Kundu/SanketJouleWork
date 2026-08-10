import { createIllustration } from "../../createIllustration";

export const FilteringColumns = createIllustration({
  name: "FilteringColumns",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default FilteringColumns;
