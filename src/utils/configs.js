// Application
export const CM_PER_INCH = 2.54;
export const PIXEL_ROUNDING_FACTOR = 2.54 / 2.5; // Factor to round cm to px conversion, preserving aspect ratio.
export const PRINT_DPI = 300;

// History
export const HISTORY_LIMIT = 10;

// Input image
export const INPUT_IMAGE_MAX_FILE_SIZE_MB = 10; // 10MB
export const INPUT_IMAGE_MAX_FILE_SIZE_BYTES = INPUT_IMAGE_MAX_FILE_SIZE_MB * 1024 * 1024; // 10MB in bytes
export const INPUT_IMAGE_BACKGROUND_COLOR = 'white';
export const INPUT_IMAGE_BORDER_COLOR = 'black';
export const INPUT_IMAGE_BORDER_WIDTH = 5; // px
export const INPUT_IMAGE_BORDER_WIDTH_SMALL = 1; // px
export const INPUT_IMAGE_BORDER_WIDTH_TINY = 0; // px

// Result image
export const RESULT_IMAGE_COLUMN_GAP = 3; // px
export const RESULT_IMAGE_ROW_GAP = 30; // px
export const RESULT_IMAGE_BACKGROUND_COLOR = 'white';

// Download
export const DOWNLOAD_RESULT_IMAGE_EXTENSION = 'png';
export const DOWNLOAD_RESULT_IMAGE_NAME = `image_to_grid.${DOWNLOAD_RESULT_IMAGE_EXTENSION}`;