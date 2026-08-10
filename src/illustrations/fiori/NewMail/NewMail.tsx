import { createIllustration } from "../../createIllustration";

export const NewMail = createIllustration({
  name: "NewMail",
  title: "New mail",
  subtitle: "You have new mail in your inbox.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default NewMail;
