import { createIllustration } from "../../createIllustration";

export const EmptyContentPane = createIllustration({
  name: "TntEmptyContentPane",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default EmptyContentPane;
