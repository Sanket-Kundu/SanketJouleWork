import { createIllustration } from "../../createIllustration";

export const Settings = createIllustration({
  name: "TntSettings",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Settings;
