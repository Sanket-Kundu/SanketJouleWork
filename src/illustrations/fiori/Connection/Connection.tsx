import { createIllustration } from "../../createIllustration";

export const Connection = createIllustration({
  name: "Connection",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Connection;
