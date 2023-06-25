import { Image, View } from "react-native";
import { ArrowType } from "./types";

const Arrow = ({
  orientation = "RIGHT",
  color = "black",
  size = 24,
  style,
}: ArrowType) => {
  let rotationDeg = 0;
  if (orientation === "LEFT") {
    rotationDeg = 180;
  }
  if (orientation === "UP") {
    rotationDeg = -90;
  }
  if (orientation === "DOWN") {
    rotationDeg = 90;
  }

  return (
    <View
      style={[
        {
          width: size,
          aspectRatio: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Image
        source={require("./assets/arrow-right.png")}
        style={[
          {
            width: "100%",
            height: "100%",
            tintColor: color,
            transform: [{ rotate: rotationDeg + "deg" }],
          },
        ]}
      />
    </View>
  );
};

export default Arrow;
