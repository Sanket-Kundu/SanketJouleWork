import { createIllustration } from "../../createIllustration";

export const SessionExpired = createIllustration({
  name: "TntSessionExpired",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SessionExpired;
