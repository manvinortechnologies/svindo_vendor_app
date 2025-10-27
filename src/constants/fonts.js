// Font Configuration
export const FONTS = {
  // Inter font family for main app
  INTER: {
    REGULAR: 'Inter-Regular',
    MEDIUM: 'Inter-Medium',
    SEMI_BOLD: 'Inter-SemiBold',
    BOLD: 'Inter-Bold',
    LIGHT: 'Inter-Light',
    THIN: 'Inter-Thin',
    EXTRA_LIGHT: 'Inter-ExtraLight',
    BLACK: 'Inter-Black',
    EXTRA_BOLD: 'Inter-ExtraBold',
  },

  // Montserrat font family for auth flow
  MONTSERRAT: {
    REGULAR: 'Montserrat-Regular',
    MEDIUM: 'Montserrat-Medium',
    SEMI_BOLD: 'Montserrat-SemiBold',
    BOLD: 'Montserrat-Bold',
    LIGHT: 'Montserrat-Light',
    THIN: 'Montserrat-Thin',
    EXTRA_LIGHT: 'Montserrat-ExtraLight',
    BLACK: 'Montserrat-Black',
    EXTRA_BOLD: 'Montserrat-ExtraBold',
  },
};

// Font weights
export const FONT_WEIGHTS = {
  THIN: '100',
  EXTRA_LIGHT: '200',
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
  BLACK: '900',
};

// Font sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  XXXXL: 32,
};

// Helper function to get font family based on context
export const getFontFamily = (isAuthFlow = false, weight = 'REGULAR') => {
  const fontFamily = isAuthFlow ? FONTS.MONTSERRAT : FONTS.INTER;
  return fontFamily[weight] || fontFamily.REGULAR;
};

// Helper function to get font style object
export const getFontStyle = (
  isAuthFlow = false,
  weight = 'REGULAR',
  size = FONT_SIZES.MD,
) => {
  return {
    fontFamily: getFontFamily(isAuthFlow, weight),
    fontSize: size,
    fontWeight: FONT_WEIGHTS[weight] || FONT_WEIGHTS.REGULAR,
  };
};
