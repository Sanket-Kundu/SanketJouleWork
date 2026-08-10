import { createIllustration } from "../../createIllustration";

export const RoadMap = createIllustration({
  name: "TntRoadMap",
  title: "",
  subtitle: "",
  lazyExtraSmall: () => import("./ExtraSmall"),
  lazySmall: () => import("./Small"),
  lazyMedium: () => import("./Medium"),
  lazyLarge: () => import("./Large"),
});

export default RoadMap;
