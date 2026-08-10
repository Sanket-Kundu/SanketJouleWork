import { createIllustration } from "../../createIllustration";

export const SuccessCheckMark = createIllustration({
  name: "SuccessCheckMark",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SuccessCheckMark;
