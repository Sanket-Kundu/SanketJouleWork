import { createIllustration } from "../../createIllustration";

export const ChartBar = createIllustration({
  name: "TntChartBar",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartBar;
