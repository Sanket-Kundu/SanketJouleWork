import { createIllustration } from "../../createIllustration";

export const ExternalLink = createIllustration({
  name: "TntExternalLink",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default ExternalLink;
