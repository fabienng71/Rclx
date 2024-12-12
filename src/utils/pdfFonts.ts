// Base64 encoded font data
export const HELVETICA_REGULAR = 'AAEAAAASAQAABAAgR0RFRgBKAAsAAAHsAAAAKEdQT1MF...' // Truncated for brevity
export const HELVETICA_BOLD = 'AAEAAAASAQAABAAgR0RFRgBKAAsAAAHsAAAAKEdQT1MF...' // Truncated for brevity
export const HELVETICA_LIGHT = 'AAEAAAASAQAABAAgR0RFRgBKAAsAAAHsAAAAKEdQT1MF...' // Truncated for brevity

export const registerFonts = () => {
  const { Font } = require('@react-pdf/renderer');
  
  Font.register({
    family: 'Helvetica',
    fonts: [
      { src: HELVETICA_REGULAR },
      { src: HELVETICA_BOLD, fontWeight: 'bold' },
      { src: HELVETICA_LIGHT, fontWeight: 'light' }
    ]
  });
};