import { createIllustration } from "../../createIllustration";

export const Secrets = createIllustration({
  name: "TntSecrets",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Secrets;
