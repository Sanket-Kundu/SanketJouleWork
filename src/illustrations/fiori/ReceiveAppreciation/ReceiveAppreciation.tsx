import { createIllustration } from "../../createIllustration";

export const ReceiveAppreciation = createIllustration({
  name: "ReceiveAppreciation",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ReceiveAppreciation;
