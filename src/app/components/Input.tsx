"use client"

interface InputProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



const Input = ({name, value, onChange}:InputProps) => {
  return (
    <input value={value} onChange={onChange} className="flex flex-1 p-2 w-full border-[1px] border-slate-300 rounded-md focus:ring-turquoise-500 focus:border-turquoise-500" name={name} placeholder={name} />
  )
}

export default Input