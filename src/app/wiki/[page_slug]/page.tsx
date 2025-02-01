'use client';

export const runtime = 'edge';
// fix for cloudflare edge runtime: https://nextjs.org/docs/app/api-reference/edge

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';

// render markdown text with html
// reference: https://stackoverflow.com/questions/70548725/any-way-to-render-html-in-react-markdown
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface Page {
  name: string;
  description: string;
  last_edit: string;
  date_created: string;
  slug: string;
}

interface Section {
  id: string;
  slug: string;
  section_type: string;
  text: string;
  parent_section_id: string | null;
  subtitle: string;
  definition_links: {
    text: string;
    link: string;
  }[];
  args: string;
}


function usePage(page_slug: string) {
  const [data, setData] = useState<Page | null>(null);

  useEffect(() => {
    fetch(`https://backend.sophiaspath.org/getPage/${page_slug}?format=json`, {
    }).then(res => {
      if (!res) {
        setData(null);
        return;
      }
      return res.json();
    }).then(resJson => {
      if (resJson.error){
        setData(null);
        return;
      }
      setData(resJson);
      document.title = "Wiki - " + resJson.name;
    }).catch(() => {
      setData(null);
    });

  }, [page_slug]);
  return data;
}

function useSections(page_slug: string) {
  const [data, setData] = useState<Section[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [footnotes, setFootnotes] = useState<{ key: string, value: string }[]>([]);

  useEffect(() => {
    fetch(`https://backend.sophiaspath.org/getSections/${page_slug}?format=json`, {
    }).then(res => {
      if (!res) {
        setData(null);
        setLoading(false);
        return;
      }
      return res.json();
    }).then(resJson => {
      if (resJson.error){
        setData(null);
        setLoading(false);
        return;
      }
      resJson.map((section: Section) => {
        // render definition links
        if (section.section_type === 't' && Object.keys(section.definition_links).length > 0) {
          for (const [text, link] of Object.entries(section.definition_links)) {
            section.text = section.text.replace(text, `<a href="/wiki/${link}" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">${text}</a>`);
          }
        }
        // preload footnotes to storage
        if (section.section_type === 'n') { 
          const footnotes: { [key: string]: string } = {};
          section.text.split('\n').map((line: string) => {
            // validate the line is a footnote
            const match = line.match(/(\d+)\.\s+(.+)/);
            if (match) {
              const [, index, content] = match;
              footnotes[index] = content;
            }
          });
          setFootnotes(Object.entries(footnotes).map(([key, value]) => ({ key, value })));
        }
      });
      setData(resJson);
      setLoading(false);
    }).catch(() => {
      setData(null);
      setLoading(false);
    });
  }, [page_slug]);

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

  return { data, isLoading, footnotes };
}

export default function WikiPage({ params }: { params: { page_slug: string } }) {
  const pageData = usePage(params.page_slug);
  const { data: sectionsData, isLoading, footnotes } = useSections(params.page_slug);
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
      {pageData && (
        <div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-4">{pageData.name}</h1>
              <p>{pageData.description}</p>
              <p>Last updated: {pageData.last_edit}</p>
              <p>Date created: {pageData.date_created}</p>
            </div>
            <Image src={"https://backend.sophiaspath.org/media/p/" + pageData.slug + "/section-" + pageData.slug + "-meta.png"}
              alt={pageData.name}
              className="w-1/2-[300px] mx-auto hover:rotate-12 transition duration-300 ease-in-out"
              width={300}
              height={300}
              priority={true} />
          </div>
        </div>
      )}
      <div className="select-none">
        {isLoading ? (
          <p>Loading...</p>
        ) : sectionsData ? (
          sectionsData.map((section: Section) => (
            <div id={section.id} key={section.slug}>
              {(() => {
                // render meta section
                if (section.section_type === 'm') {
                  return (
                    <>
                      <div className="h-6" />
                      <div id={section.id}>
                          <Markdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkMath]} components={{
                            sup: ({ children }) => (
                              <span className='inline-flex'>

                                {/* Life saver: https://stackoverflow.com/a/75638084/14110380 use span with inline-flex to fix the tooltip position */}
                                <Tooltip className='max-w-[300px]' content={<Markdown rehypePlugins={[rehypeRaw]} components={{
                                  p: ({ children }) => (
                                    <span>{children}</span>
                                )
                              }}>{footnotes.find(footnote => footnote.key === children)?.value}</Markdown>}>
                                {/* Tooltip content with flowbite-react: https://flowbite-react.com/docs/components/tooltip */}
                                <sup>{children}</sup>
                              </Tooltip>
                              </span>
                            ),
                            p: ({ children }) => (
                              <div>{children}</div>
                            )
                          }}>{section.text}</Markdown>
                        </div>
                    </>
                  )
                }
                // skip footnote section
                else if (section.section_type === 'n') {
                  return null;
                }
                // render arrow section
                else if (section.section_type === 'a') {
                  return (
                    <>
                      <div className="h-6" />
                      <h1 className="text-2xl font-bold mb-4 hover:underline hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <a href={`/wiki/${section.args}`} id={section.slug}> {(() => {
                          const match = section.subtitle.match(/Arrow to \[(.*)\]\s+\("(.*)"\)/);
                          if (match) {
                            return match[2] + " with " + match[1];
                          }
                          return section.subtitle;
                        })()}
                        </a>
                      </h1>
                      <div id={section.id}>
                          <Markdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkMath]} components={{
                            sup: ({ children }) => (
                              <span className='inline-flex'>
                                {/* Life saver: https://stackoverflow.com/a/75638084/14110380 use span with inline-flex to fix the tooltip position */}
                                <Tooltip className='max-w-[300px]' content={<Markdown rehypePlugins={[rehypeRaw]} components={{
                                  p: ({ children }) => (
                                    <span>{children}</span>
                                )
                              }}>{footnotes.find(footnote => footnote.key === children)?.value}</Markdown>}>
                                {/* Tooltip content with flowbite-react: https://flowbite-react.com/docs/components/tooltip */}
                                <sup>{children}</sup>
                              </Tooltip>
                              </span>
                            ),
                            p: ({ children }) => (
                              <div>{children}</div>
                            )
                          }}>{section.text}</Markdown>
                        </div>
                    </>
                  )
                }
                // render reference section
                else if (section.section_type === 'r') {
                  const lines = section.text.split('\n').filter(line => line.trim() !== '');
                  return (
                    <>
                      <div className="h-6" />
                      <h1
                        className="text-2xl font-bold mb-4 hover:underline cursor-pointer"
                        onClick={() => {
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Read More
                      </h1>
                      {lines.map((l: string, index: number) => {
                        return (
                          <div key={`reference-${index}`}>
                              <Markdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkMath]} components={{
                            // skip tooltip render for reference section
                            p: ({ children }) => (
                              <div>{children}</div>
                            )
                          }}>{"["+(index + 1)+"]. "+l}</Markdown>
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
                        <div className="h-6" />
                        <h1
                          className="text-2xl font-bold mb-4 hover:underline cursor-pointer"
                          onClick={() => {
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          <a href={`#${section.slug}`} id={section.slug}>{section.subtitle}</a>
                        </h1>
                        <div id={section.id}>
                          <Markdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkMath]} components={{
                            sup: ({ children }) => (
                              <span className='inline-flex'>
                                {/* Life saver: https://stackoverflow.com/a/75638084/14110380 use span with inline-flex to fix the tooltip position */}
                                <Tooltip className='max-w-[300px]' content={<Markdown rehypePlugins={[rehypeRaw]} components={{
                                  p: ({ children }) => (
                                    <span>{children}</span>
                                )
                              }}>{footnotes.find(footnote => footnote.key === children)?.value}</Markdown>}>
                                {/* Tooltip content with flowbite-react: https://flowbite-react.com/docs/components/tooltip */}
                                <sup>{children}</sup>
                              </Tooltip>
                              </span>
                            ),
                            p: ({ children }) => (
                              <div>{children}</div>
                            )
                          }}>{section.text}</Markdown>
                        </div>
                      </>
                    )
                  }
                  // render child section
                  else {
                    return (
                      <>
                        <div className="h-6" />
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
                            <div id={section.id} className='flex flex-col'>
                            <Markdown rehypePlugins={[rehypeRaw, rehypeKatex]} remarkPlugins={[remarkMath]} components={{
                            sup: ({ children }) => (
                              <span className='inline-flex'>
                                <Tooltip className='max-w-[300px]' content={<Markdown rehypePlugins={[rehypeRaw]} components={{
                                  p: ({ children }) => (

                                    <span>{children}</span>
                                )
                              }}>{footnotes.find(footnote => footnote.key === children)?.value}</Markdown>}>
                                  <sup>{children}</sup>
                                </Tooltip>
                              </span>
                            ),
                            p: ({ children }) => (
                              <div>{children}</div>
                            )
                          }}>{section.text}</Markdown>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                }
              })()}
            </div>
          ))
        ) : (
          <p>Sections not found</p>
        )}
      </div>
    </div>
  );
}