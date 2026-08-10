import { createIllustration } from "../../createIllustration";

export const Teams = createIllustration({
  name: "TntTeams",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default Teams;
