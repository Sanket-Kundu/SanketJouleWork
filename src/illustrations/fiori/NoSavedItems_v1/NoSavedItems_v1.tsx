import { createIllustration } from "../../createIllustration";

export const NoSavedItems_v1 = createIllustration({
  name: "NoSavedItems_v1",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoSavedItems_v1;
