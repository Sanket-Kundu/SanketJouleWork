import { createIllustration } from "../../createIllustration";

export const SimpleError = createIllustration({
  name: "SimpleError",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleError;
