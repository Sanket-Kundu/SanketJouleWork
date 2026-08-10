import { createIllustration } from "../../createIllustration";

export const ChartBPMNFlow = createIllustration({
  name: "TntChartBPMNFlow",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartBPMNFlow;
