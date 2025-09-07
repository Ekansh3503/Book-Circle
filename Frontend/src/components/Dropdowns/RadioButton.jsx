import React from 'react'

const RadioButton = ({ label, checked, onChange, name, value }) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange(value)}
        name={name}
        value={value}
        className="form-radio h-5 w-5"
      />
      <span >{label}</span>
    </label>
  )
}

export default RadioButton