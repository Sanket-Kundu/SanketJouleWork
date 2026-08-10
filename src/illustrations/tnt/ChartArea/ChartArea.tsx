import { createIllustration } from "../../createIllustration";

export const ChartArea = createIllustration({
  name: "TntChartArea",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartArea;
