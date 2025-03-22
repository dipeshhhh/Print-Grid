import { useContext, createContext, useState, useRef, useEffect } from "react";
import { useChangeManagement } from "./ChangeManagementContext";
import { INITIAL_IMAGE_SIZES, INITIAL_IMAGE_STATE, INITIAL_SHEET_SIZES } from "../utils/initialValues";
import { INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY, LAST_IS_BORDERED_VALUE_LOCAL_STORAGE_KEY, LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY, LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY, RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY } from "../utils/configs";

const ImageContext = createContext();

export function useImage() {
  return useContext(ImageContext);
}

export function ImageProvider({ children }) {
  const {
    generatingResultFlag,
    setAreChangesBeingApplied,
    setIsEditDisabled,
    setIsGenerateDisabled
  } = useChangeManagement();
  // Input Referrer: for the file/image input element
  const inputRef = useRef(null);
  const [image, setImage] = useState({ ...INITIAL_IMAGE_STATE });
  const originalImageBackup = useRef(null);
  const [isBordered, setIsBordered] = useState(
    (localStorage.getItem(LAST_IS_BORDERED_VALUE_LOCAL_STORAGE_KEY))
      ?
      JSON.parse(localStorage.getItem(LAST_IS_BORDERED_VALUE_LOCAL_STORAGE_KEY))
      :
      false
  );
  // Image and Sheet sizes in px
  // Checking existance in local storage
  const [imageSizes, setImageSizes] = useState(
    (localStorage.getItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY))
      ?
      [...JSON.parse(localStorage.getItem(INPUT_IMAGE_SIZES_LOCAL_STORAGE_KEY))]
      :
      [...INITIAL_IMAGE_SIZES]
  );
  const [sheetSizes, setSheetSizes] = useState(
    (localStorage.getItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY))
      ?
      [...JSON.parse(localStorage.getItem(RESULT_IMAGE_SHEET_SIZES_LOCAL_STORAGE_KEY))]
      :
      [...INITIAL_SHEET_SIZES]
  );
  const [selectedImageSize, setSelectedImageSize] = useState(
    (localStorage.getItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY))
      ?
      JSON.parse(localStorage.getItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY))
      :
      imageSizes[0]
  );
  const [selectedSheetSize, setSelectedSheetSize] = useState(
    (localStorage.getItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY))
      ?
      JSON.parse(localStorage.getItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY))
      :
      sheetSizes[0]
  );

  useEffect(() => {
    localStorage.setItem(LAST_SELECTED_IMAGE_SIZE_LOCAL_STORAGE_KEY, JSON.stringify(selectedImageSize));
    localStorage.setItem(LAST_SELECTED_SHEET_SIZE_LOCAL_STORAGE_KEY, JSON.stringify(selectedSheetSize));
  }, [selectedImageSize, selectedSheetSize]);

  useEffect(() => {
    localStorage.setItem(LAST_IS_BORDERED_VALUE_LOCAL_STORAGE_KEY, JSON.stringify(isBordered));
  }, [isBordered]);

  useEffect(() => {
    if (!image.url) {
      setIsEditDisabled(true);
      setIsGenerateDisabled(true);
      return;
    };
    setIsEditDisabled(false);
    setIsGenerateDisabled(false);
  }, [image]);

  async function applyChangesToImage() {
    if (!image.url) return;
    // If result image is not being generated and no change has happened, prevent doing all this again
    if ((!generatingResultFlag.current) && (image.rotate === 0) && (image.verticalScale === 1) && (image.horizontalScale === 1)) return;

    setAreChangesBeingApplied(true);

    let canvasDataUrl;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image.url;

    // must use await here to wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        if (image.rotate === 0 && image.verticalScale === 1 && image.horizontalScale === 1) {
          canvasDataUrl = canvas.toDataURL('image/png');
          resolve();
        }

        if (image.rotate !== 0) {
          if ((image.rotate / 90) % 2 !== 0) {
            canvas.width = img.naturalHeight;
            canvas.height = img.naturalWidth;
            ctx.translate(img.naturalHeight / 2, img.naturalWidth / 2);
            ctx.rotate(image.rotate * Math.PI / 180);
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2, img.naturalWidth, img.naturalHeight);
          }
          else {
            ctx.translate(img.naturalWidth / 2, img.naturalHeight / 2);
            ctx.rotate(image.rotate * Math.PI / 180);
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2, img.naturalWidth, img.naturalHeight);
          }
        }
        if (image.verticalScale !== 1) {
          ctx.translate(0, img.naturalHeight);
          ctx.scale(1, -1);
          ctx.drawImage(img,
            image.rotate !== 0 ? -img.naturalWidth / 2 : 0,
            image.rotate !== 0 ? img.naturalHeight / 2 : 0,
            img.naturalWidth,
            img.naturalHeight);
        }
        if (image.horizontalScale !== 1) {
          ctx.translate(img.naturalWidth, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img,
            image.rotate !== 0 ? img.naturalWidth / 2 : 0,
            image.rotate !== 0 ? -img.naturalHeight / 2 : 0,
            img.naturalWidth,
            img.naturalHeight);
        }
        canvasDataUrl = canvas.toDataURL('image/png');
        setImage({
          ...image,
          url: canvasDataUrl,
          naturalHeight: image.rotate !== 0 ? img.naturalWidth : img.naturalHeight,
          naturalWidth: image.rotate !== 0 ? img.naturalHeight : img.naturalWidth,
          rotate: image.rotate !== 0 ? 0 : image.rotate,
          verticalScale: image.verticalScale !== 1 ? 1 : image.verticalScale,
          horizontalScale: image.horizontalScale !== 1 ? 1 : image.horizontalScale,
        });
        resolve();
      }
      img.onerror = reject;
    });
    return canvasDataUrl;
  }

  return (
    <ImageContext.Provider value={{
      inputRef,
      image,
      setImage,
      originalImageBackup,
      isBordered,
      setIsBordered,
      imageSizes,
      setImageSizes,
      sheetSizes,
      setSheetSizes,
      selectedImageSize,
      setSelectedImageSize,
      selectedSheetSize,
      setSelectedSheetSize,
      applyChangesToImage
    }}>
      {children}
    </ImageContext.Provider>
  )
}