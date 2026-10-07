import Svg, { Circle } from "react-native-svg";
import { Colors } from "../constants";

type Props = {
  size: number;
  strokeWidth: number;
  // 0..1
  progress: number;
  color?: string;
  trackColor?: string;
};

export const ProgressRing = ({
  size,
  strokeWidth,
  progress,
  color = Colors.primary,
  trackColor = Colors.track,
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const center = size / 2;

  return (
    <Svg width={size} height={size} accessibilityElementsHidden>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {clamped > 0 && (
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * clamped} ${circumference}`}
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </Svg>
  );
};
