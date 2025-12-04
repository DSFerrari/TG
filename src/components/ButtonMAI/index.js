import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import { Ionicons } from '@expo/vector-icons';

export default function ButtonMAI({
  name,
  limpo,
  icon,
  tamanho,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  ...props
}) {
  const bgColor = disabled 
    ? theme.COLORS.GRAY
    : limpo 
    ? theme.COLORS.BLUE1 
    : theme.COLORS.WHITE3;
  
  const textColor = disabled
    ? theme.COLORS.GRAY2
    : limpo 
    ? theme.COLORS.WHITE3 
    : theme.COLORS.BLUE1;
  
  const iconColor = disabled
    ? theme.COLORS.GRAY2
    : limpo 
    ? theme.COLORS.WHITE3 
    : theme.COLORS.BLACK1;

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <View style={{ marginTop: 32 }}>
      <TouchableOpacity
        {...props}
        onPress={handlePress}
        style={[
          styles.Button, 
          { 
            backgroundColor: bgColor,
            opacity: disabled ? 0.6 : 1,
          }
        ]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || name}
        accessibilityHint={
          accessibilityHint ||
          `Ativa a função: ${name}`
        }
        accessible={true}
        focusable={!disabled}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        )}

        <Text
          style={[
            styles.ButtonText,
            { color: textColor }
          ]}
          maxFontSizeMultiplier={1.6}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}