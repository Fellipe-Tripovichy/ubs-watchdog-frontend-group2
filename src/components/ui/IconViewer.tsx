import React from 'react';
import * as Icons from 'lucide-react';

interface IconViewerProps {
  iconName: string;
  size?: number | string;
  color?: string;
  className?: string;
}

/**
 * IconViewer component that dynamically renders lucide-react icons by name
 * @param iconName - Name of the icon (case-insensitive, e.g., 'Telescope', 'telescope', or 'Triangle-alert')
 * @param size - Size of the icon (default: 24)
 * @param color - Color of the icon (default: 'currentColor')
 * @param className - Additional CSS classes
 */
const IconViewer: React.FC<IconViewerProps> = ({ 
  iconName, 
  size = 24, 
  color = 'currentColor',
  className 
}) => {
  // Try to find the icon component with case-insensitive matching
  // First try exact match, then try various case variations
  const findIcon = (name: string): React.ComponentType<any> | null => {
    // Try exact match first
    if ((Icons as any)[name]) {
      return (Icons as any)[name];
    }

    // Convert hyphenated names to PascalCase (e.g., "Triangle-alert" -> "TriangleAlert")
    if (name.includes('-')) {
      const pascalCaseFromHyphen = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
      if ((Icons as any)[pascalCaseFromHyphen]) {
        return (Icons as any)[pascalCaseFromHyphen];
      }
    }

    // Try PascalCase (first letter uppercase, rest lowercase)
    const pascalCase = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    if ((Icons as any)[pascalCase]) {
      return (Icons as any)[pascalCase];
    }

    // Try to find by matching keys case-insensitively
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

  // Convert size to number if it's a string
  const iconSize = typeof size === 'string' ? parseInt(size, 10) || 24 : size;

  // If icon doesn't exist, show placeholder with low opacity
  if (!IconComponent) {
    // Use HelpCircle as fallback icon
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

    // Fallback SVG if HelpCircle is not available
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

  // Render the found icon
  return (
    <IconComponent 
      size={iconSize} 
      color={color}
      className={className}
    />
  );
};

export default IconViewer;

