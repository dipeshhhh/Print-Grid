import { PRINT_DPI, CM_PER_INCH, PIXEL_ROUNDING_FACTOR } from './configs.js';

export const cmToPx = (cm) => (((cm * PRINT_DPI) / CM_PER_INCH) * PIXEL_ROUNDING_FACTOR);
export const inchToCm = (inch) => (inch * CM_PER_INCH);
export const inchToPx = (inch) => (cmToPx(inchToCm(inch)));