import React, { useEffect, useRef } from 'react';

const ReactionDisplay = ({ reactions, parentRef, onReactionClick }) => {
  const reactionContainerRef = useRef(null);

  useEffect(() => {
    if (parentRef.current && reactionContainerRef.current) {
      const container = reactionContainerRef.current;
      const parent = parentRef.current;
      parent.style.position = 'relative';
      container.style.position = 'absolute';
      container.style.right = '-6px';
      container.style.bottom = '-10px';
      container.style.zIndex = '1001';
    }
  }, [reactions, parentRef]);

  if (!reactions || Object.keys(reactions).length === 0) return null;

  return (
    <div ref={reactionContainerRef} className="flex cursor-pointer gap-1">
      {Object.entries(reactions || {}).map(([userId, emoji]) => (
        <span
          key={userId}
          style={{ fontSize: '16px' }}
          onClick={onReactionClick}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default ReactionDisplay;
