import { createIllustration } from "../../createIllustration";

export const Success = createIllustration({
  name: "TntSuccess",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Success;
