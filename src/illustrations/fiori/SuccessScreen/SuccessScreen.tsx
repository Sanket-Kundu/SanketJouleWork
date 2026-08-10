import { createIllustration } from "../../createIllustration";

export const SuccessScreen = createIllustration({
  name: "SuccessScreen",
  title: "Nicely done!",
  subtitle: "You completed all your learning assignments.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SuccessScreen;
