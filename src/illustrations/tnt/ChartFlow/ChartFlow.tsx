import { createIllustration } from "../../createIllustration";

export const ChartFlow = createIllustration({
  name: "TntChartFlow",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartFlow;
