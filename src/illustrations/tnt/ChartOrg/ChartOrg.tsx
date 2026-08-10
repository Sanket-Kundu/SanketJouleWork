import { createIllustration } from "../../createIllustration";

export const ChartOrg = createIllustration({
  name: "TntChartOrg",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ChartOrg;
