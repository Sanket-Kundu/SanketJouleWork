import { createIllustration } from "../../createIllustration";

export const NoData = createIllustration({
  name: "NoData",
  title: "There\'s no data yet.",
  subtitle: "When there is, you\'ll see it here.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoData;
