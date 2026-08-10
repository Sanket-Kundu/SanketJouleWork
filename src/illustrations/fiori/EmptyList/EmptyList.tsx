import { createIllustration } from "../../createIllustration";

export const EmptyList = createIllustration({
  name: "EmptyList",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default EmptyList;
