import { createIllustration } from "../../createIllustration";

export const Tent = createIllustration({
  name: "Tent",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Tent;
