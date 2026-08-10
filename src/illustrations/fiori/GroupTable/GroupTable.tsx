import { createIllustration } from "../../createIllustration";

export const GroupTable = createIllustration({
  name: "GroupTable",
  title: "Try grouping items for a better overview",
  subtitle: "You can choose grouping categories in the group settings.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default GroupTable;
