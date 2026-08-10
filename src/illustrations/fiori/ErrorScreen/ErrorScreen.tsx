import { createIllustration } from "../../createIllustration";

export const ErrorScreen = createIllustration({
  name: "ErrorScreen",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ErrorScreen;
