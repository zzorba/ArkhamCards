import React, { useContext } from 'react';

export const StepPaddingContext = React.createContext<{ side: number}>({ side: 0 });

export const ExtraStepPaddingProvider = ({ children, padding }: { children: React.ReactNode; padding: number }) => {
  const { side } = useContext(StepPaddingContext);
  return (
    <StepPaddingContext.Provider value={{ side: side + padding }}>
      {children}
    </StepPaddingContext.Provider>
  );
}