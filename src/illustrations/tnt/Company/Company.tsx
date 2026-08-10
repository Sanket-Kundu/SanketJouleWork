import { createIllustration } from "../../createIllustration";

export const Company = createIllustration({
  name: "TntCompany",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Company;
