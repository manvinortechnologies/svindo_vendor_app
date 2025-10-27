import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { getFontFamily, getFontStyle } from "../constants/fonts";

// Responsive scaling functions for better naming and consistency
export const responsiveWidth = (size: number) => scale(size);
export const responsiveHeight = (size: number) => verticalScale(size);
export const responsiveFontSize = (size: number, factor?: number) =>
  moderateScale(size, factor);
export const responsiveVerticalSize = (size: number, factor?: number) =>
  moderateVerticalScale(size, factor);

// Specific utility functions for common use cases
export const rs = responsiveWidth; // Short alias for width
export const rh = responsiveHeight; // Short alias for height
export const rf = responsiveFontSize; // Short alias for font size
export const rv = responsiveVerticalSize; // Short alias for vertical spacing

// Predefined responsive values for consistency
export const ResponsiveValues = {
  // Font sizes
  fontSizes: {
    extraSmall: rf(10),
    small: rf(12),
    medium: rf(14),
    large: rf(16),
    extraLarge: rf(18),
    heading: rf(20),
    title: rf(24),
    largeTitle: rf(28),
  },

  // Spacing
  spacing: {
    tiny: rs(2),
    extraSmall: rs(4),
    small: rs(8),
    medium: rs(12),
    large: rs(16),
    extraLarge: rs(20),
    huge: rs(24),
    massive: rs(32),
  },

  // Heights
  heights: {
    button: rh(44),
    input: rh(48),
    header: rh(56),
    tabBar: rh(60),
    cardSmall: rh(120),
    cardMedium: rh(160),
    cardLarge: rh(200),
  },

  // Border radius
  borderRadius: {
    small: rs(4),
    medium: rs(8),
    large: rs(12),
    extraLarge: rs(16),
    circular: rs(50),
  },

  // Icon sizes
  iconSizes: {
    tiny: rs(12),
    small: rs(16),
    medium: rs(20),
    large: rs(24),
    extraLarge: rs(28),
    huge: rs(32),
  },
};

// Helper function to get responsive dimensions for images
export const getResponsiveImageSize = (width: number, height: number) => ({
  width: rs(width),
  height: rh(height),
});

// Helper function for responsive padding/margin
export const getResponsiveSpacing = (
  top: number = 0,
  right: number = 0,
  bottom: number = 0,
  left: number = 0
) => ({
  paddingTop: rh(top),
  paddingRight: rs(right),
  paddingBottom: rh(bottom),
  paddingLeft: rs(left),
});

// Font helper functions
export const getResponsiveFontFamily = (
  isAuthFlow = false,
  weight = "REGULAR"
) => {
  return getFontFamily(isAuthFlow, weight);
};

export const getResponsiveFontStyle = (
  isAuthFlow = false,
  weight = "REGULAR",
  size?: number
) => {
  const fontSize = size ? rf(size) : undefined;
  return getFontStyle(isAuthFlow, weight, fontSize);
};

// Predefined font styles for common use cases
export const FontStyles = {
  // Main app fonts (Inter)
  main: {
    regular: (size?: number) => getResponsiveFontStyle(false, "REGULAR", size),
    medium: (size?: number) => getResponsiveFontStyle(false, "MEDIUM", size),
    semiBold: (size?: number) =>
      getResponsiveFontStyle(false, "SEMI_BOLD", size),
    bold: (size?: number) => getResponsiveFontStyle(false, "BOLD", size),
    light: (size?: number) => getResponsiveFontStyle(false, "LIGHT", size),
  },

  // Auth flow fonts (Montserrat)
  auth: {
    regular: (size?: number) => getResponsiveFontStyle(true, "REGULAR", size),
    medium: (size?: number) => getResponsiveFontStyle(true, "MEDIUM", size),
    semiBold: (size?: number) =>
      getResponsiveFontStyle(true, "SEMI_BOLD", size),
    bold: (size?: number) => getResponsiveFontStyle(true, "BOLD", size),
    light: (size?: number) => getResponsiveFontStyle(true, "LIGHT", size),
  },
};

export default {
  rs,
  rh,
  rf,
  rv,
  ResponsiveValues,
  getResponsiveImageSize,
  getResponsiveSpacing,
  getResponsiveFontFamily,
  getResponsiveFontStyle,
  FontStyles,
};
