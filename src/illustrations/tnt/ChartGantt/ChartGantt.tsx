import { createIllustration } from "../../createIllustration";

export const ChartGantt = createIllustration({
  name: "TntChartGantt",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartGantt;
