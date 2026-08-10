import { createIllustration } from "../../createIllustration";

export const MissionFailed = createIllustration({
  name: "TntMissionFailed",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default MissionFailed;
