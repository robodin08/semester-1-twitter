import { Image, useColorScheme } from "react-native";

import DarkLogo from "../../assets/images/logo_dark.png";
import LightLogo from "../../assets/images/logo_light.png";

export default function ThemedLogo({ ...props }) {
  const colorScheme = useColorScheme();

  const logo = colorScheme === "dark" ? DarkLogo : LightLogo;

  return <Image source={logo} {...props} />;
}
