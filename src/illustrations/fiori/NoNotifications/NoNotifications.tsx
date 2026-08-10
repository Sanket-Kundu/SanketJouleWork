import { createIllustration } from "../../createIllustration";

export const NoNotifications = createIllustration({
  name: "NoNotifications",
  title: "You\'ve no notifications",
  subtitle: "Check back again later.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoNotifications;
