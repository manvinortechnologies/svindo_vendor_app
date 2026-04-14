import { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";

export const InputBox = ({
  label,
  placeholder,
  editable = true,
  background = "#fff",
  value,
  onChangeText,
  autoCapitalize = "none",
  keyboardType = "default",
  maxLength,
  styless,
  textInputStyle,
  multiline,
  numberOfLines,
  onBlur,
  error,
  ...props
}: {
  label?: string;
  placeholder?: string;
  editable?: boolean;
  background?: string;
  value?: string;
  maxLength?: number;
  onChangeText?: (text: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  styless?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  numberOfLines?: number;
  onBlur?: () => void;
  error?: string;
}) => (
  <View style={[{ marginBottom: 12 }, styless]}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      placeholder={placeholder}
      editable={editable}
      style={[
        styles.input,
        {
          backgroundColor: background,
          textAlignVertical: multiline ? "top" : "auto",
        },
        error && styles.inputError,
        textInputStyle,
      ]}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onBlur={onBlur}
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);
const styles = ScaledSheet.create({
  label: {
    marginBottom: 4,
    fontWeight: "600",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA511",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
