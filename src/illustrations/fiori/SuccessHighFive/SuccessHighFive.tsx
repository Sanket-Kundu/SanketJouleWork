import { createIllustration } from "../../createIllustration";

export const SuccessHighFive = createIllustration({
  name: "SuccessHighFive",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SuccessHighFive;
