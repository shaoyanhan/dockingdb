import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children,  // The element that triggers the tooltip when hovered  
  content,  // The text to display in the tooltip
  position = 'top', // The position of the tooltip relative to the element
  className = ''  // Optional CSS classes to add to the wrapper element
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState({
    top: 0,
    left: 0,
  });

  // Calculate position based on wrapper and tooltip dimensions
  useEffect(() => {
    if (isVisible && tooltipRef.current && wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = -tooltipRect.height - 8;
          left = (wrapperRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = wrapperRect.height + 8;
          left = (wrapperRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = (wrapperRect.height - tooltipRect.height) / 2;
          left = -tooltipRect.width - 8;
          break;
        case 'right':
          top = (wrapperRect.height - tooltipRect.height) / 2;
          left = wrapperRect.width + 8;
          break;
      }
      
      setTooltipStyle({ top, left });
    }
  }, [isVisible, position]);

  return (
    <div 
      ref={wrapperRef}
      className={`inline-block relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg
            whitespace-nowrap transform origin-center
            animate-fadeInScale
          `}
          style={{
            top: `${tooltipStyle.top}px`,
            left: `${tooltipStyle.left}px`
          }}
        >
          {content}
          <div 
            className={`
              absolute w-2 h-2 bg-gray-900 transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 