import React from 'react'

const Checkbox = ({ label, checked, onChange, className }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer w-full ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox h-4 w-4 flex-shrink-0 text-blue-600"
      />
      <span className="ml-2 text-sm break-words">{label}</span>
    </label>
  )
}

export default Checkbox