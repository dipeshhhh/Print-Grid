import { createContext, useContext, useRef, useEffect } from "react";
import { areObjectsDeepEqual } from "../utils/helpers";
import { useChangeManagement } from "./ChangeManagementContext";
import { useImage } from "./ImageContext";
import { HISTORY_LIMIT } from "../utils/configs";

const HistoryContext = createContext();

export function useHistory() {
  return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
  const {
    image
  } = useImage();

  const {
    setAreChangesBeingApplied,
    areChangesBeingApplied,
    setIsUndoDisabled,
    setIsRedoDisabled
  } = useChangeManagement();

  // Edit History
  const editHistory = useRef([]);
  const editHistoryIndex = useRef(-1);
  const redoFlag = useRef(false); // Flag to prevent adding duplicate entries in the history when redo is clicked after undo

  useEffect(() => {
    if (!image.url) return;

    // Add the current image to the edit history
    if ((!areObjectsDeepEqual(editHistory.current[editHistoryIndex.current], image)) && (!areChangesBeingApplied)) {
      if (editHistoryIndex.current === (editHistory.current.length - 1)) {
        // Add the current image to history if no undo operation was performed before the new change and if it's not the last image in history.
        editHistory.current.push({ ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      else if (!redoFlag.current) {
        // If a new change is made after undoing without redoing, remove forward history and add the current image to the history.
        editHistory.current.splice(editHistoryIndex.current + 1, editHistory.current.length - editHistoryIndex.current, { ...image });
        editHistoryIndex.current = editHistory.current.length - 1;
      }
      // Reset the redo flag
      redoFlag.current = false;
    }
    // Applying history limit
    if (editHistory.current.length > HISTORY_LIMIT) {
      editHistory.current.shift();
      editHistoryIndex.current--;
    }
    // Enable/Disable undo and redo buttons
    setIsUndoDisabled(editHistoryIndex.current === 0);
    setIsRedoDisabled(editHistoryIndex.current === (editHistory.current.length - 1));

    setAreChangesBeingApplied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <HistoryContext.Provider value={{
      editHistory,
      editHistoryIndex,
      redoFlag
    }}>
      {children}
    </HistoryContext.Provider>
  )
}