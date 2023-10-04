import React from 'react'
import { BiSearchAlt } from 'react-icons/bi'

const Search = () => {
  return (
    <div className="col-span-3 hidden lg:flex lg:flex-col px-2 py-1">
        <form action="" className="bg-secondary p-2 rounded-full px-4 flex gap-2 items-center">
            <BiSearchAlt />
            <input type="text" placeholder='Search' className="bg-secondary focus:outline-none" />
        </form>
    </div>
  )
}

export default Search