// context/NotFoundContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type NotFoundContextType = {
  isNotFound: boolean;
  setIsNotFound: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotFoundContext = createContext<NotFoundContextType>({
  isNotFound: false,
  setIsNotFound: () => {},
});

export function NotFoundProvider({ children }: { children: React.ReactNode }) {
  const [isNotFound, setIsNotFound] = useState(false);

  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
      {children}
    </NotFoundContext.Provider>
  );
}

export const useNotFound = () => useContext(NotFoundContext);
