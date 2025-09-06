import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, family, fonts, metrics, styles as appStyles } from "../themes";

const MenuItem = ({
  title,
  icon,
  onPress,
  rightIcon,
  containerStyle,
  textStyle,
  iconWidth = 24,
  iconHeight = 24,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[style.container, containerStyle]}>
        {/* Left Section (icon + text) */}
        <View style={style.leftSection}>
          <Image
            source={icon}
            style={{
              width: iconWidth,
              height: iconHeight,
              resizeMode: "contain",
            }}
          />
          <Text style={[style.text, textStyle]}>{title}</Text>
        </View>

        {/* Right Icon (optional, default arrow) */}
        {/* <Image
          style={style.rightIcon}
          source={
            rightIcon ||
            require("../../../../Assets/image/angle-small-right.png")
          }
        /> */}
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: metrics.m16,
    paddingHorizontal: metrics.m20,
    marginVertical: metrics.m8,
    backgroundColor: colors.lightGray, // 👈 soft background color
    borderRadius: metrics.m12,
    alignItems: "center",
    ...appStyles.shadow, // shadow if defined in your theme
    elevation: 3, // Android shadow
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: metrics.m12,
  },
  text: {
    fontSize: fonts.fs_16,
    fontFamily: family.medium,
    color: colors.textPrimary,
  },
  rightIcon: {
    width: metrics.m18,
    height: metrics.m18,
    resizeMode: "contain",
    tintColor: colors.textSecondary, // 👈 arrow color matches theme
  },
});

export default MenuItem;
