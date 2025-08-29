"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect,Suspense } from "react";

interface Section {
  subtitle: string;
  text: string;
  url: string;
}
function Search() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const [results, setResults] = useState<Section[] | null>(null);
  const [sortOrder, setSortOrder] = useState("relevance");
  const [isLoading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (search) {
      fetch(`https://sophiaspathbackend-production.up.railway.app/search?q=${search}&sort=${sortOrder}&page=${page}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.sections);
          setTotalPages(data.total_pages);
          setLoading(false);
        }).catch(() => {
          setResults(null);
          setLoading(false);
          setTotalPages(0);
        });
    }
  }, [search, sortOrder, page]);

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
        {isLoading ? <div>Loading...</div> : (
          results && results.length > 0 ? (
            <>
              {results.map((result, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                  <h2 className="text-xl font-bold">{result.subtitle}</h2>
                  <p dangerouslySetInnerHTML={{ __html: result.text.replace(new RegExp(search || '', 'gi'), (match: string) => `<mark>${match}</mark>`) }}></p>
                  <a href={"/wiki/" + result.url} className="text-blue-500 hover:underline">
                    Read more
                  </a>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={`page-${i}`}
                      onClick={() => setPage(i + 1)}
                      className={i + 1 == page ? "mx-1 px-3 py-1 border rounded hover:bg-gray-100 bg-gray-300" : "mx-1 px-3 py-1 border rounded hover:bg-gray-100"}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>No results found</p>
          )
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
