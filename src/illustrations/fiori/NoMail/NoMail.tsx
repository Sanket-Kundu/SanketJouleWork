import { createIllustration } from "../../createIllustration";

export const NoMail = createIllustration({
  name: "NoMail",
  title: "No mail",
  subtitle: "Check back again later.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NoMail;
