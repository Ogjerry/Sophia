"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect,Suspense } from "react";

interface SearchResult {
  subtitle: string;
  text: string;
  url: string;
}
function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sortOrder, setSortOrder] = useState("relevance");

  useEffect(() => {
    if (search) {
      fetch(`https://backend.sophiaspath.org/search?q=${search}&sort=${sortOrder}`)
        .then((res) => res.json())
        .then((data) => setResults(data));
    }
  }, [search, sortOrder]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mr-2">Search Results for &ldquo;{search}&rdquo;</h1>
          </div>
          <div>
            <label className="mr-2">Sort by:</label>
            <select
              className="border border-gray-300 rounded p-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
              <h2 className="text-xl font-bold">{result.subtitle}</h2>
              <p dangerouslySetInnerHTML={{ __html: result.text.replace(new RegExp(search || '', 'gi'), (match: string) => `<mark>${match}</mark>`) }}></p>
              <a href={"/wiki/" + result.url} className="text-blue-500 hover:underline">
                Read more
              </a>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  );
}
