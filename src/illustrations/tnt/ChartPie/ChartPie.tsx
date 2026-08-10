import { createIllustration } from "../../createIllustration";

export const ChartPie = createIllustration({
  name: "TntChartPie",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartPie;
