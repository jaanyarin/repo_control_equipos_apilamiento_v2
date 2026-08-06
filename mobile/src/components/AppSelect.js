import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, HelperText, Portal, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../theme";

export default function AppSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  disabled,
  accessibilityLabel,
  onOpen,
  style,
}) {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const anchorRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const selected = options.find((option) => option.value === value);

  const openMenu = () => {
    if (typeof onOpen === "function") onOpen();
    setVisible(true);
    const node = anchorRef.current;
    if (node && typeof node.measureInWindow === "function") {
      node.measureInWindow((x, y, width, height) => {
        setAnchor({ x, y, width, height });
      });
    }
  };

  const closeMenu = () => setVisible(false);

  const menuMaxHeight = anchor
    ? Math.max(120, windowHeight - anchor.y - anchor.height - insets.bottom - 24)
    : Math.max(120, windowHeight - insets.top - insets.bottom - 160);

  return (
    <View style={[{ width: "100%" }, style]}>
      <Text
        style={[
          theme.typography.body2,
          {
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1],
          },
        ]}
      >
        {label}
      </Text>
      <View ref={anchorRef} collapsable={false} style={{ width: "100%" }}>
        <Button
          mode="outlined"
          icon="chevron-down"
          contentStyle={{
            minHeight: 52,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
          textColor={
            selected ? theme.colors.text.primary : theme.colors.text.tertiary
          }
          style={{
            width: "100%",
            borderRadius: theme.radius.sm,
            borderColor: error
              ? theme.colors.border.error
              : theme.colors.border.strong,
          }}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel || label}
          onPress={openMenu}
        >
          {selected?.label || placeholder}
        </Button>
      </View>
      {visible ? (
        <Portal>
          <Pressable style={styles.overlay} onPress={closeMenu} testID="select-overlay" />
          <View
            style={[
              styles.menu,
              anchor
                ? { left: anchor.x, top: anchor.y + anchor.height + 4, width: anchor.width }
                : { left: 16, right: 16, top: 80 },
              { maxHeight: menuMaxHeight },
            ]}
            testID="select-menu"
          >
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => {
                      onChange(option.value, option);
                      closeMenu();
                    }}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.optionText,
                        isSelected && { color: theme.colors.action.primary },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Portal>
      ) : null}
      {error ? (
        <HelperText type="error" visible>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background.backdrop,
  },
  menu: {
    position: "absolute",
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  optionSelected: {
    backgroundColor: theme.colors.background.neutral,
  },
  optionText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
});
