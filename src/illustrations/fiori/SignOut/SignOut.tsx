import { createIllustration } from "../../createIllustration";

export const SignOut = createIllustration({
  name: "SignOut",
  title: "You\'ve been signed out",
  subtitle: "You can now close this window.",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default SignOut;
