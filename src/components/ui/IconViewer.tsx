import React from 'react';
import * as Icons from 'lucide-react';

interface IconViewerProps {
  iconName: string;
  size?: number | string;
  color?: string;
  className?: string;
}

const IconViewer: React.FC<IconViewerProps> = ({ 
  iconName, 
  size = 24, 
  color = 'currentColor',
  className 
}) => {
  const findIcon = (name: string): React.ComponentType<any> | null => {
    if ((Icons as any)[name]) {
      return (Icons as any)[name];
    }

    if (name.includes('-')) {
      const pascalCaseFromHyphen = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
      if ((Icons as any)[pascalCaseFromHyphen]) {
        return (Icons as any)[pascalCaseFromHyphen];
      }
    }

    const pascalCase = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if ((Icons as any)[pascalCase]) {
      return (Icons as any)[pascalCase];
    }

    const iconKeys = Object.keys(Icons);
    const matchedKey = iconKeys.find(
      key => key.toLowerCase() === name.toLowerCase()
    );

    if (matchedKey) {
      return (Icons as any)[matchedKey];
    }

    return null;
  };

  const IconComponent = findIcon(iconName);

  const iconSize = typeof size === 'string' ? parseInt(size, 10) || 24 : size;

  if (!IconComponent) {
    const HelpCircle = (Icons as any).HelpCircle;

    if (HelpCircle) {
      return (
        <HelpCircle 
          size={iconSize} 
          color={color}
          className={className}
          style={{ opacity: 0.2 }}
          aria-label={`Icon "${iconName}" not found`}
        />
      );
    }

    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ opacity: 0.2 }}
        aria-label={`Icon "${iconName}" not found`}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }

  return (
    <IconComponent 
      size={iconSize} 
      color={color}
      className={className}
    />
  );
};

export default IconViewer;