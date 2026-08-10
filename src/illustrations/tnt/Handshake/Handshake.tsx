import { createIllustration } from "../../createIllustration";

export const Handshake = createIllustration({
  name: "TntHandshake",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Handshake;
