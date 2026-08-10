import { createIllustration } from "../../createIllustration";

export const ChartArea2 = createIllustration({
  name: "TntChartArea2",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartArea2;
