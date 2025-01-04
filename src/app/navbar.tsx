"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-gray-100 p-4 flex items-center">
        <h1 className="text-2xl font-bold flex-shrink-0 cursor-pointer">
        <Link href="/">Sophia's Path</Link>
      </h1>
      <div className="flex justify-center w-full mx-4">
        <form className="w-full max-w-md" onSubmit={(e) => { 
          e.preventDefault(); 
          const query = (e.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
          window.location.href = `/search?q=${query.value}&order=relevance`;
        }}>
          <input type="text" name="search" className="border border-gray-300 rounded p-2 w-full" placeholder="Search..." />
        </form>
      </div>
      <div className="flex-shrink-0">
        {/* <Link href="/placeholder">
          <button className="bg-blue-500 text-white p-2 rounded">Placeholder</button>
        </Link> */}
      </div>
    </div>
  )
}