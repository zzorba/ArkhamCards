import { Text, TouchableOpacity, View } from "react-native";
import React, { useState, useContext, ReactNode, useCallback } from "react";
import StyleContext from "@styles/StyleContext";

interface Props {
  label: string | undefined;
  children: ReactNode;
  height: number;
  width: number
}
export default function ToolTip({ label, height, width, children }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [toggle, setToggle] = useState(false);

  const handlePressIn = useCallback(() => {
    setToggle(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setToggle(false);
  }, []);

  return (
    <>
      {toggle && (
        <>
          <View
            style={{
              position: "absolute",
              backgroundColor: colors.background,
              bottom: height+5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              borderRadius: 10,
              borderColor: colors.lightText,
              borderWidth: 1,
              paddingVertical: 4,
              paddingHorizontal: 5,
              left: -40,
              right: -40,
            }}
          >
            <Text style={[typography.small, typography.regular,  { textAlign: "center" }]}>
              {label}
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              left: width / 2 - 7.5,
              bottom: height,
              backgroundColor: "transparent",
              borderStyle: "solid",
              borderLeftWidth: 7.5,
              borderRightWidth: 7.5,
              borderBottomWidth: 6,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: colors.lightText,
              position: "absolute",
              transform: [{ rotate: "180deg" }],
            }}
          />
        </>
      )}
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </TouchableOpacity>
    </>
  );
}
