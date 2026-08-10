import { createIllustration } from "../../createIllustration";

export const Fingerprint = createIllustration({
  name: "TntFingerprint",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Fingerprint;
