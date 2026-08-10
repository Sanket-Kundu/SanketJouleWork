import { createIllustration } from "../../createIllustration";

export const SimpleNotFoundMagnifier = createIllustration({
  name: "SimpleNotFoundMagnifier",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleNotFoundMagnifier;
