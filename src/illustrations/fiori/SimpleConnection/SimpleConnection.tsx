import { createIllustration } from "../../createIllustration";

export const SimpleConnection = createIllustration({
  name: "SimpleConnection",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleConnection;
