import { cmToPx, inchToPx } from './converters.js';

// Input image sizes
//! Do not use 'custom' (any case) as a name, it is reserved for custom sizes.
export const INITIAL_IMAGE_SIZES = [
  {
    "name": '3cm x 4cm',
    "width": cmToPx(2.95), // 0.05cm less than said size to preserve gap between images
    "height": cmToPx(3.95), // same reason as above
  },
  {
    "name": '3.5cm x 4.5cm',
    "width": cmToPx(3.5),
    "height": cmToPx(4.5),
  },
  {
    "name": '2x2 inch (Indian passport)',
    "width": inchToPx(2),
    "height": inchToPx(2),
  }
];

// Sheet sizes
//! Do not use 'custom' (any character-case) as a name, it is reserved for custom sizes.
export const INITIAL_SHEET_SIZES = [
  {
    "name": 'A4',
    "width": cmToPx(21),
    "height": cmToPx(29.7),
  },
  {
    "name": "A3",
    "width": cmToPx(29.7),
    "height": cmToPx(42)
  },
  {
    "name": 'Letter',
    "width": inchToPx(8.5),
    "height": inchToPx(11),
  }
];

// Image state
export const INITIAL_IMAGE_STATE = {
  imageUrl: false,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  grayscale: 0,
  sepia: 0,
  rotate: 0,
  verticalScale: 1,
  horizontalScale: 1,
  naturalHeight: false,
  naturalWidth: false
}