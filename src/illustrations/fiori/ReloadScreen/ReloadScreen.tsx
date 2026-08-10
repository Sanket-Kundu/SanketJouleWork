import { createIllustration } from "../../createIllustration";

export const ReloadScreen = createIllustration({
  name: "ReloadScreen",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ReloadScreen;
