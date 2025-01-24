'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Network } from 'vis-network';
import * as d3 from 'd3';

const GraphPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);


  // add backend image access path
  const PHILOSOPHER_IMAGE_BASE_URL = 'https://backend.sophiaspath.org/media/pic/';

  // 1) Define nodes. Each "faction" is a big box node with some margin.
  //    Philosophers are image nodes with the same 'group' property.
  const initialNodes = useMemo(
    () => [
      // ---------- Logical Atomism BOX ----------
      {
        id: 1,
        label: 'Logical Atomism',
        group: 'Logical Atomism',
        shape: 'box',
        // Use margin to avoid text overlap inside the box
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#e3f2fd', border: '#42a5f5' },
        font: { size: 18, color: '#343a40', multi: false },
      },
      // Logical Atomism Philosophers
      {
        id: 2,
        label: 'Bertrand Russell',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Russell.png',
      },
      {
        id: 3,
        label: 'Ludwig Wittgenstein',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Wittgenstein.png',
      },
      {
        id: 4,
        label: 'Gottlob Frege',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Gottlob-Frege.png',
      },

      // ---------- Logical Positivism BOX ----------
      {
        id: 5,
        label: 'Logical Positivism',
        group: 'Logical Positivism',
        shape: 'box',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#fce4ec', border: '#e91e63' },
        font: { size: 18, color: '#343a40' },
      },
      // Logical Positivism Philosophers
      {
        id: 6,
        label: 'Vienna Circle',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Vienna-Circle.png',
      },
      {
        id: 7,
        label: 'A.J. Ayer',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'AJ-Ayer.png',
      },
      {
        id: 8,
        label: 'Rudolf Carnap',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Carnap.png',
      },

      // ---------- Ordinary Language BOX ----------
      {
        id: 9,
        label: 'Ordinary Language Philosophy',
        group: 'Ordinary Language Philosophy',
        shape: 'box',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#fff9c4', border: '#fbc02d' },
        font: { size: 16, color: '#343a40' },
      },
      // Ordinary Language Philosophers
      {
        id: 10,
        label: 'P.F. Strawson',
        group: 'Ordinary Language Philosophy',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Strawson.png',
      },
      {
        id: 11,
        label: 'J.L. Austin',
        group: 'Ordinary Language Philosophy',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Austin.png',
      },
      {
        id: 12,
        label: 'Gilbert Ryle',
        group: 'Ordinary Language Philosophy',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Ryle.png',
      },

      // ---------- Logical Empiricism BOX ----------
      {
        id: 13,
        label: 'Logical Empiricism and its End',
        group: 'Logical Empiricism and its End',
        shape: 'box',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#e8f5e9', border: '#4caf50' },
        font: { size: 16, color: '#343a40' },
      },
      // Logical Empiricism Philosophers
      {
        id: 14,
        label: 'Willard Van Orman Quine',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Quine.png',
      },
      {
        id: 15,
        label: 'Wilfrid Sellars',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Sellars.png',
      },
      {
        id: 16,
        label: 'Roderick Chisholm',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Chisholm.png',
      },
    ],
    []
  );

  // 2) Build edges to keep philosophers near their box, plus any custom edges
  const edges = useMemo(
    () => [
      // Keep each philosopher near its faction box
      // "length" controls how close or far they'll orbit the box under physics
      { from: 1, to: 2, length: 120 },
      { from: 1, to: 3, length: 120 },
      { from: 1, to: 4, length: 120 },

      { from: 5, to: 6, length: 120 },
      { from: 5, to: 7, length: 120 },
      { from: 5, to: 8, length: 120 },

      { from: 9, to: 10, length: 120 },
      { from: 9, to: 11, length: 120 },
      { from: 9, to: 12, length: 120 },

      { from: 13, to: 14, length: 120 },
      { from: 13, to: 15, length: 120 },
      { from: 13, to: 16, length: 120 },

      // -- EXAMPLE: Cross-group edges you want to keep (Influence/Objection) --
      // If you want to replicate your original custom edges, just add them here.
      // Example:
      // { from: 2, to: 7, label: 'Influence', arrows: 'to', color: { color: 'green' } },
      // { from: 3, to: 10, label: 'Objection', arrows: 'to', color: { color: 'red' } },
    ],
    []
  );

  // 3) Initialize network with physics
  useEffect(() => {
    if (containerRef.current) {
      const options = {
        // Turn off hierarchical layout
        layout: {
          hierarchical: false,
        },
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -40,
            centralGravity: 0.002,
            springLength: 100,
            springConstant: 0.08,
          },
          // tweak "stabilization"
          stabilization: { iterations: 100 },
        },
        nodes: {
          borderWidth: 2,
          shadow: true,
          font: { size: 14, color: '#343a40' },
        },
        edges: {
          color: { color: '#848484', highlight: '#ff0000' },
          width: 2,
          smooth: {
            enabled: true,
            type: 'dynamic',
            roundness: 0.2,
          },
        },
      };

      const networkInstance = new Network(
        containerRef.current,
        { nodes: initialNodes, edges },
        options
      );
      networkRef.current = networkInstance;

      // D3 zoom + built-in zoom
      const svg = d3.select(containerRef.current as HTMLDivElement);
      const zoom: d3.ZoomBehavior<HTMLDivElement, unknown> = d3
        .zoom<HTMLDivElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          svg.selectAll('g').attr('transform', event.transform);
        });
      svg.call(zoom);

      // set filters default mode
      networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
          setShowFilterButton(true);
        } else {
          setShowFilters(false);
          setShowFilterButton(false);
        }
      });
    }
  }, [edges, initialNodes]);

  // 4) Filter function (same as before). Hide nodes that don't match the chosen group.
  const filterGraph = (group: string) => {
    if (networkRef.current) {
      const filteredNodes = initialNodes.map((node) => ({
        ...node,
        hidden: group !== '' && node.group !== group,
      }));
      networkRef.current.setData({ nodes: filteredNodes, edges });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* The container for the graph */}
      <div
        ref={containerRef}
        style={{ height: '600px', width: '100%', backgroundColor: 'white' }}
      />

      {/* Toggle button to show filters */}
      {showFilterButton && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: '60px',
            right: '10px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            gap: '10px',
          }}
        >
          <button
            onClick={() => filterGraph('Logical Atomism')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Logical Atomism
          </button>
          <button
            onClick={() => filterGraph('Logical Positivism')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Logical Positivism
          </button>
          <button
            onClick={() => filterGraph('Ordinary Language Philosophy')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Ordinary Language
          </button>
          <button
            onClick={() => filterGraph('Logical Empiricism and its End')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Logical Empiricism
          </button>
          <button
            onClick={() => filterGraph('')} // Show all
            style={{ backgroundColor: 'grey', color: 'white', padding: '10px' }}
          >
            Show All
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphPage;
