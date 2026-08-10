import { createIllustration } from "../../createIllustration";

export const ChartDoughnut = createIllustration({
  name: "TntChartDoughnut",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartDoughnut;
