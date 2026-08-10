import { createIllustration } from "../../createIllustration";

export const GroupingColumns = createIllustration({
  name: "GroupingColumns",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default GroupingColumns;
