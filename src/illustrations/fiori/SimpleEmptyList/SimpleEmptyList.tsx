import { createIllustration } from "../../createIllustration";

export const SimpleEmptyList = createIllustration({
  name: "SimpleEmptyList",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleEmptyList;
