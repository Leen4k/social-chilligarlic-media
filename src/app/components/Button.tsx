import React from 'react'
import { ButtonProps } from '../types/Button'

const Button = ({type,action,bgColor,disabled,text}:ButtonProps) => {
  return (
    <button 
        type={type || "submit"} 
        onClick={action}
        disabled={disabled}
        className={`disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex basis-1/4 items-center justify-center gap-4 ${bgColor} text-white rounded-full font-semibold py-2 w-full justify-center`}>
        <span>{text}</span>
    </button>
  )
}

export default Button