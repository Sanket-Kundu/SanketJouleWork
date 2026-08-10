import { createIllustration } from "../../createIllustration";

export const PageNotFound = createIllustration({
  name: "PageNotFound",
  title: "Sorry, we can\'t find this page",
  subtitle: "Please check the URL you are using to call the app.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default PageNotFound;
