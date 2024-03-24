import { INPUT_IMAGE_MAX_FILE_SIZE_BYTES, INPUT_IMAGE_MAX_FILE_SIZE_MB} from './configs.js';

import { INITIAL_IMAGE_STATE } from './initialValues.js';

export const areObjectsDeepEqual = (obj1, obj2) => {
  if (!(obj1 && typeof obj1 === 'object') || !(obj2 && typeof obj2 === 'object')) return false;
  if (obj1 === obj2) return true;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

export const validateImageFile = (file) => {
  if (!file) return false;
  let result = true;
  if (!(file.type.startsWith('image/'))) {
    alert('Please select an image file.');
    result = false;
  }
  else if (file.size > INPUT_IMAGE_MAX_FILE_SIZE_BYTES) {
    alert(`File size should be less than ${INPUT_IMAGE_MAX_FILE_SIZE_MB}MB`);
    result = false;
  }
  return result;
}

export const validateImageFiles = (files) => {
  let result = true;
  if (files && (files.length > 0)) {
    for (let file of files) {
      if (!validateImageFile(file)) {
        result = false;
        break;
      }
    };
  }
  else result = false;
  return result;
}