'use client';
import { useState, useEffect } from 'react';
 
function getServerSideProps(philosopher_id:string) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const res = fetch(`https://backend.sophiaspath.org/getSections/${philosopher_id}?format=json`,{
      credentials: 'include',
      method: 'GET',
      headers: {
        'no-cors': 'true',
        'Content-Type': 'application/json',
        // goddamn fix for: request has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
    .then(res => res.json())
    .then((data) => {
      setData(data);
      setLoading(false);
    })
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;
  return (
    <div>
      {data.map((section: any) => (
        <div key={section.subtitle}>
          <h3>{section.subtitle}</h3>
          <p>{section.text}</p>
        </div>
      ))}
    </div>
  );
}
 
// TODO: change id to philosopher_name for better url readability

export default function WikiPage({ params }: { params: { philosopher_id: string } }) {
  const sectionsData = getServerSideProps(params.philosopher_id);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wiki Page</h1>
      <h2>{params.philosopher_id}</h2>
      <p>fetching from {params.philosopher_id}</p>
      {sectionsData}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {}}
      >
        Click Me
      </button>
    </div>
  );
}