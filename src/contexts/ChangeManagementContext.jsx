import { useContext, createContext, useRef, useState } from "react";

const ChangeManagementContext = createContext();

export function useChangeManagement() {
  return useContext(ChangeManagementContext);
}

export function ChangeManagementProvider({ children }) {
  // Flags to prevent concurrent edits, multiple image generations on repeated clicks, and duplicate entries in the history while changes are being applied.
  const generatingResultFlag = useRef(false);
  const [areChangesBeingApplied, setAreChangesBeingApplied] = useState(false);

  // Edit states (Cropping) ensure the image section is re-rendered with the latest image when the user opens Crop dialog, preventing edits to an outdated image.
  const [isUserCropping, setIsUserCropping] = useState(false);

  // Button states: Disabled or not
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [isUndoDisabled, setIsUndoDisabled] = useState(true);
  const [isRedoDisabled, setIsRedoDisabled] = useState(true);

  return (
    <ChangeManagementContext.Provider value={{
      generatingResultFlag,
      areChangesBeingApplied,
      setAreChangesBeingApplied,
      isUserCropping,
      setIsUserCropping,
      isGenerateDisabled,
      setIsGenerateDisabled,
      isEditDisabled,
      setIsEditDisabled,
      isUndoDisabled,
      setIsUndoDisabled,
      isRedoDisabled,
      setIsRedoDisabled
    }}>
      {children}
    </ChangeManagementContext.Provider>
  )
}