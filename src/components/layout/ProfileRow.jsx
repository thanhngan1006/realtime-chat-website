import React from 'react';

const ProfileRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-3 shadow-sm">
      <span className="font-medium text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
};

export default ProfileRow;
