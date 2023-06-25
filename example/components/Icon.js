import { Image, View } from "react-native";
import food from "../assets/food.png"
import laptop from "../assets/laptop.png"

const icons = {
    food:food,
    laptop:laptop
}

const Icon = ({ name, color = "black", size = 24, style }) => {
    const uri = Image.resolveAssetSource(icons[name]).uri

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
        source={{uri}}
        style={[
          {
            width: "100%",
            height: "100%",
            tintColor: color,
          },
        ]}
      />
    </View>
  );
};

export default Icon;
