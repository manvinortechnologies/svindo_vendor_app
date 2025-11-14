import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomSwitch from "./CustomSwitch";

export default function OptionInput({
  icon,
  label,
  value,
  onChangeText,
  keyboardType,
  boldLabelPrefix,
}: {
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  boldLabelPrefix?: string;
  icon?: string;
  label?: string;
  value?: string;
}) {
  return (
    <View style={styles.optionItem}>
      {icon && (
        <Icon name={icon} size={18} color="#666" style={styles.optionIcon} />
      )}
      {boldLabelPrefix && (
        <>
          <Text style={[styles.optionText, styles.lrText]}>
            {boldLabelPrefix}
          </Text>
          {/* <Text style={styles.optionText}>{label}</Text> */}
        </>
      )}
      {label === "Reverse Charge" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={[styles.optionText]}>{label}</Text>
          <CustomSwitch value={value} onValueChange={onChangeText} />
        </View>
      ) : (
        <TextInput
          style={styles.optionInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          placeholder={label}
          placeholderTextColor="#aaa"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#DEDEDE",
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    color: "#666",
    fontSize: 14,
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
    // borderBottomWidth: 1,
    // borderBottomColor: "#FFD272",
    paddingVertical: 2,
  },
  lrText: {
    fontWeight: "bold",
    marginRight: 10,
  },
});
