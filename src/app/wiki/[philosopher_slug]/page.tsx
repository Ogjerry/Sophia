'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function usePhilosopher(philosopher_slug: string) {
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

  }, [philosopher_slug]);
  return data;
}

function useSections(philosopher_slug: string) {
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
  }, [philosopher_slug]);

  // scroll to the section when the page is loaded completely
  useEffect(() => {
    if (!isLoading && data) {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [isLoading, data]);

  return { data, isLoading };
}

export default function WikiPage({ params }: { params: { philosopher_slug: string } }) {
  const philosopherData = usePhilosopher(params.philosopher_slug);
  const { data: sectionsData, isLoading } = useSections(params.philosopher_slug);
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
      {philosopherData && (
        <div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <h2>{philosopherData.name}</h2>
              <p>{philosopherData.description}</p>
              <p>Last updated: {philosopherData.last_edit}</p>
              <p>Date created: {philosopherData.date_created}</p>
            </div>
            <Image src={"https://backend.sophiaspath.org/media/p/" + philosopherData.slug + "/section-" + philosopherData.slug + "-meta.png"} 
            alt={philosopherData.name} 
            className="w-1/2 mx-auto hover:rotate-12 transition duration-300 ease-in-out" 
            width={500} 
            height={500}
            priority={true} />
          </div>
        </div>
      )}
      <div className="select-none">
        {isLoading ? (
          <p>Loading...</p>
        ) : sectionsData ? (
          sectionsData.map((section: any) => (
            <div id={section.id} key={section.slug}>
              <div className="h-6" />
              {(() => {
                // render meta section
                if (section.section_type === 'm') {
                  return (
                    <div dangerouslySetInnerHTML={{ __html: section.text }} id={section.id} />
                  )
                } 
                // render reference section
                else if (section.section_type === 'r') {
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
                      {link.map((l: string, index: number) => {
                        const [text, url] = l.split('(');
                        return (
                          <div key={index}>
                            <a href={url} target="_blank" className="hover:underline">
                              [{index + 1}]. {text}
                            </a>
                            <br />
                          </div>
                        )
                      })}
                    </>
                  )
                } 
                // render normal section
                else {
                  if (section.parent_section_id === null) {
                    return (
                      <>
                        <h1
                          className="text-2xl font-bold mb-4 hover:underline cursor-pointer"
                          onClick={() => {
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <a href={`#${section.slug}`} id={section.slug}>{section.subtitle}</a>
                        </h1>
                        <div dangerouslySetInnerHTML={{ __html: section.text }} id={section.id} />
                      </>
                    )
                  }
                  // render child section
                  else {
                    return (
                      <div className="flex">
                        <div className="w-1/12"></div> {/* This div creates the tab space */}
                        <div className="w-11/12">
                          <h2
                            className="text-xl font-bold mb-4 hover:underline cursor-pointer"
                            onClick={() => {
                              document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            <a href={`#${section.slug}`} id={section.slug}>{section.subtitle}</a>
                          </h2>
                          <div dangerouslySetInnerHTML={{ __html: section.text }} id={section.id} />
                        </div>
                      </div>
                    )
                  }
                }
              })()}
              {/* TODO: add links to other sections, assume the section text is safe */}
            </div>
          ))
        ) : (
          <p>Sections not found</p>
        )}
      </div>
    </div>
  );
}