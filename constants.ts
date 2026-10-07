export const Colors = {
  background: "#F4F6F5",
  surface: "#FFFFFF",
  surfaceMuted: "#FAFCFB",
  border: "#B9CCC6",
  divider: "#E8EEEC",
  track: "#DCE5E2",

  primary: "#0F6B5C",
  primaryDark: "#0A4F44",
  primaryTint: "#E3F0EC",
  primaryRing: "#D4E9E3",

  danger: "#B4362A",
  dangerDark: "#7A2219",
  dangerTint: "#FBEDEB",
  dangerText: "#5C2620",

  warning: "#E9B44C",
  warningText: "#8A5A00",

  text: {
    primary: "#12201C",
    secondary: "#3E4D48",
    muted: "#4F5E59",
    subtle: "#5E6D68",
    inverse: "#FFFFFF",
    onTint: "#23413A",
  },

  disabled: "#C5D0CC",
  overlay: "rgba(18, 32, 28, 0.6)",
  shadow: "#000",
} as const;

export const Fonts = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extrabold: "Manrope_800ExtraBold",
} as const;

export const CHECKIN_INTERVAL_HOURS = 48;

export const BACKEND_URL =
  "https://us-central1-tudo-bem-85e5f.cloudfunctions.net";

export const DEVICE_ID_KEY = "deviceId";
