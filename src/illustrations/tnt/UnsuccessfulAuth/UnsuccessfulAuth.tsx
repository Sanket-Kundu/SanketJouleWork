import { createIllustration } from "../../createIllustration";

export const UnsuccessfulAuth = createIllustration({
  name: "TntUnsuccessfulAuth",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UnsuccessfulAuth;
