const symbols = [
  "swap_vert",
  "swap_horiz",
  "rotate_90_degrees_ccw",
  "rotate_90_degrees_cw",
  "tune",
  "crop",
  "undo",
  "redo",
  "history",
  "light_mode",
  "dark_mode",
  "brightness_medium",
  "contrast",
  "opacity",
  "mode_heat",
  "palette",
  "filter_b_and_w",
]

const sortedSymbols = symbols.sort().join(',');

const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1&icon_names=${sortedSymbols}&display=block`;

export function loadMaterialDesignSymbols() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);
}