import React from "react";

const Avatar = ({ size = 8, src }) => {
  const baseStyles = `text-${size} rounded-full`;

  return <img className={`${baseStyles}`} src={`${src}`} />;
};

export default Avatar;
