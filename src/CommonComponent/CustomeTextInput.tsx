import React from 'react'
import { StyleSheet, TextInput, KeyboardTypeOptions, StyleProp, TextStyle } from 'react-native'

interface CustomTextInputProps {
    // You can define your props here if needed
    placeholder?: string;
    placeholderTextColor?: string;
    styles?: StyleProp<TextStyle>;
    onChangeText?: (text: string) => void;
    value?: string;
    editable?: boolean,
    keyboardType?: KeyboardTypeOptions,
    maxLength?: number
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    placeholder = 'Description',
    placeholderTextColor = "#999",
    styles: customStyles,
    onChangeText,
    value,
    editable = true,
    keyboardType = 'default',
    // secureTextEntry = false,
    autoCapitalize = 'none',
    // autoCorrect = false,
    maxLength,
    // multiline = false,
    // numberOfLines = 1,
    // returnKeyType = 'done',
    // onBlur,
    // onFocus,
}) => {
    return (
        <>
            <TextInput
                style={[styles.input, customStyles]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChangeText}
                value={value}
                editable={editable}
                keyboardType={keyboardType}
                maxLength={maxLength}
                // secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
            // autoCorrect={autoCorrect}
            // maxLength={maxLength}
            // multiline={multiline}
            // numberOfLines={numberOfLines}
            // returnKeyType={returnKeyType}
            // onBlur={onBlur}
            // onFocus={onFocus}

            />
        </>
    )
}
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#FFF7DD',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
        color: '#333',
        // marginBottom: 20,
        borderColor: '#FCA511',
        borderWidth: 1,
    },
})

export default CustomTextInput
