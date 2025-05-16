
import React from 'react';

interface MobileSafeAreaProps {
  children: React.ReactNode;
}

export const MobileSafeArea: React.FC<MobileSafeAreaProps> = ({ children }) => {
  return (
    <div className="mobile-safe-area">
      {children}
    </div>
  );
};
