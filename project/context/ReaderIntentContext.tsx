import React, { createContext, useContext, useState } from 'react';

type Reference = { book: string; chapter: number };

type ReaderIntentContextType = {
  /** A reference chosen elsewhere that the reader should open next. */
  pendingReference: Reference | null;
  requestReference: (book: string, chapter: number) => void;
  clearReference: () => void;
};

const ReaderIntentContext = createContext<ReaderIntentContextType>({
  pendingReference: null,
  requestReference: () => {},
  clearReference: () => {},
});

/**
 * Carries a chosen reference from the books pages back to the reader. Route
 * params cannot do this job: the reader's tab is already mounted, so
 * navigating to it does not deliver new params.
 */
export const ReaderIntentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingReference, setPendingReference] = useState<Reference | null>(null);

  const requestReference = (book: string, chapter: number) =>
    setPendingReference({ book, chapter });

  const clearReference = () => setPendingReference(null);

  return (
    <ReaderIntentContext.Provider
      value={{ pendingReference, requestReference, clearReference }}
    >
      {children}
    </ReaderIntentContext.Provider>
  );
};

export const useReaderIntent = () => useContext(ReaderIntentContext);
