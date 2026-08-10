import { createIllustration } from "../../createIllustration";

export const SuccessfulAuth = createIllustration({
  name: "TntSuccessfulAuth",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SuccessfulAuth;
