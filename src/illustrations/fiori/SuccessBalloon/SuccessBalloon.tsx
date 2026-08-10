import { createIllustration } from "../../createIllustration";

export const SuccessBalloon = createIllustration({
  name: "SuccessBalloon",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SuccessBalloon;
