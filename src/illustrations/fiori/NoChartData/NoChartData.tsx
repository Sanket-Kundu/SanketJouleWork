import { createIllustration } from "../../createIllustration";

export const NoChartData = createIllustration({
  name: "NoChartData",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoChartData;
