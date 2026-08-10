import { createIllustration } from "../../createIllustration";

export const BalloonSky = createIllustration({
  name: "BalloonSky",
  title: "You\'ve been appreciated!",
  subtitle: "Keep up the great work!",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default BalloonSky;
