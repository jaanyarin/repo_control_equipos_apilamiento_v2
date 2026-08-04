import React, { useState } from "react";
import { View } from "react-native";
import { Button, HelperText, Menu, Text } from "react-native-paper";
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
  style,
}) {
  const [visible, setVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const selected = options.find((option) => option.value === value);

  const anchor = (
    <View
      style={{ width: "100%" }}
      onLayout={(event) => {
        setAnchorWidth(event.nativeEvent.layout.width);
      }}
    >
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
        onPress={() => setVisible(true)}
      >
        {selected?.label || placeholder}
      </Button>
    </View>
  );

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
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={anchorWidth ? { width: anchorWidth } : undefined}
        anchor={anchor}
      >
        {options.map((option) => (
          <Menu.Item
            key={String(option.value)}
            title={option.label}
            onPress={() => {
              onChange(option.value, option);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
      {error ? (
        <HelperText type="error" visible>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
}
