import React from 'react';

const TypingDots = () => {
  return (
    <div className="inline-flex rounded-2xl bg-[#f1f1f1] px-1 py-2">
      <div className="mx-1 h-1 w-1 animate-[animateDots_1.8s_ease-in-out_infinite_200ms] rounded-[3px] bg-[#6c757d] opacity-70"></div>
      <div className="mx-1 h-1 w-1 animate-[animateDots_1.8s_ease-in-out_infinite_300ms] rounded-[3px] bg-[#6c757d] opacity-70"></div>
      <div className="mx-1 h-1 w-1 animate-[animateDots_1.8s_ease-in-out_infinite_200ms] rounded-[3px] bg-[#6c757d] opacity-70"></div>
    </div>
  );
};

export default TypingDots;
