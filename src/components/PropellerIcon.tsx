import React from 'react';

interface PropellerIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const PropellerIcon: React.FC<PropellerIconProps> = ({ className = 'prop', style }) => {
  return (
    <svg className={className} style={style} viewBox="-50 -50 100 100" aria-hidden="true">
      <g>
        <ellipse cx="0" cy="-25" rx="14" ry="23" />
        <ellipse cx="0" cy="-25" rx="14" ry="23" transform="rotate(120)" />
        <ellipse cx="0" cy="-25" rx="14" ry="23" transform="rotate(240)" />
        <circle r="8" />
      </g>
    </svg>
  );
};
