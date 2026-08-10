import { createIllustration } from "../../createIllustration";

export const SimpleNoSavedItems = createIllustration({
  name: "SimpleNoSavedItems",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SimpleNoSavedItems;
