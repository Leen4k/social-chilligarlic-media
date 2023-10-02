import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const session = await getServerSession();
  console.log(session);
  return (
    <div className="col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <div className="p-4 font-bold text-xl">
        Hello Mom
      </div>
      <div className="flex text-center">
        <Link href="/" className="flex-1 py-4">For you</Link>
        <Link href="/following" className="flex-1 py-4">Following</Link>
      </div>
    </div>
  )
}

export default page