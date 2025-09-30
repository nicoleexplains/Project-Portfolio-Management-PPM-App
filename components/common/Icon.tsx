
import React, { useEffect } from 'react';

// This is a global declaration for the 'lucide' library.
declare global {
  interface Window {
    lucide: {
      createIcons: () => void;
    };
  }
}

interface IconProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
}

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [name, className]);

    return (
        <i
            data-lucide={name}
            className={className}
            {...props}
        />
    );
};

export default Icon;
