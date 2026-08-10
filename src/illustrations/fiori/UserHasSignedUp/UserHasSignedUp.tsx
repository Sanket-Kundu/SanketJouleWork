import { createIllustration } from "../../createIllustration";

export const UserHasSignedUp = createIllustration({
  name: "UserHasSignedUp",
  title: "Success!",
  subtitle: "You set up your account. Want to take a quick tour?",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default UserHasSignedUp;
