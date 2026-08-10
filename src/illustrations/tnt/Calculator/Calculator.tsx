import { createIllustration } from "../../createIllustration";

export const Calculator = createIllustration({
  name: "TntCalculator",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Calculator;
