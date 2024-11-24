'use client';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation';

function parseText(text: string) {
  // return text;
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getPhilosopher(philosopher_slug: string) {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch(`https://backend.sophiaspath.org/getPhilosopher/${philosopher_slug}?format=json`, {
    }).then(res => {
      if (!res) return null;
      return res.json();
    }).then(resJson => {
      setData(resJson);
      document.title = "Wiki - " + resJson.name;
    });

  }, []);
  if (!data) return null;
  return (
    <div>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          <p>Last updated: {data.last_edit}</p>
          <p>Date created: {data.date_created}</p>
        </div>
        <img src={"https://backend.sophiaspath.org/media/p/" + data.slug + "/section-" + data.slug + "-meta.png"} alt={data.name} className="w-1/2 mx-auto hover:rotate-12 transition duration-300 ease-in-out" />
      </div>
    </div>
  );
}

function getSections(philosopher_slug: string) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://backend.sophiaspath.org/getSections/${philosopher_slug}?format=json`, {
    }).then(res => {
      if (!res) return null;
      return res.json();
    }).then(resJson => {
      setData(resJson);
      setLoading(false);
    });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Sections not found</p>;

  return (
    <div className="container mx-auto p-4">
      {data.map((section: any) => (
        <div key={section.subtitle}>
          <div className="h-6" />
          {(() => {
            if (section.section_type === 'm') {
              return (
                <div dangerouslySetInnerHTML={{ __html: section.text }} id={section.id} />
              )
            } else if (section.section_type === 'r') {
              const content = section.text;
              const link = content.split(')');
              return (
                <>
                  <h1
                    className="text-2xl font-bold mb-4 hover:underline cursor-pointer"
                    onClick={() => {
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Read More
                  </h1>
                  {link.map((l: string) => {
                    const [text, url] = l.split('(');
                    return (
                      <>
                      <a href={url} target="_blank">
                        {text}
                      </a>
                      <br>
                      </br>
                      </>
                    )
                  })}
                </>
              )
            } else {
              return (
                <>
                  <h1
                    className="text-2xl font-bold mb-4 hover:underline cursor-pointer"
                    onClick={() => {
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {section.subtitle}
                  </h1>
                  <div dangerouslySetInnerHTML={{ __html: section.text }} id={section.id} />
                </>
              )
            }
          })()}
          {/* TODO: add links to other sections, assume the section text is safe */}
        </div>
      ))}
    </div>
  );

}

// TODO: change id to philosopher_name for better url readability

export default function WikiPage({ params }: { params: { philosopher_slug: string } }) {
  const philosopherData = getPhilosopher(params.philosopher_slug);
  const sectionsData = getSections(params.philosopher_slug);
  const router = useRouter();
  return (

    <div className="container mx-auto p-4">

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600 ease-in-out"
        onClick={() => {
          router.push('/graph');
        }}
      >
        Back to Graph
      </button>

      <div className="h-6" />
      <h1 className="text-2xl font-bold mb-4">Wiki Page</h1>
      <h2>{philosopherData}</h2>
      <div className="select-none">
        {sectionsData}
      </div>
    </div>
  );
}