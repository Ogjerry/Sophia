'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Network } from 'vis-network';
import * as d3 from 'd3';

const GraphPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);

  const PHILOSOPHER_IMAGE_BASE_URL = "https://sophiaspathbackend-production.up.railway.app/media/pic/";

  // 1) Define your nodes (same as before)
  const initialNodes = useMemo(
    () => [
      {
        id: 1,
        label: 'Logical Atomism',
        group: 'Logical Atomism',
        shape: 'box',
        wikiUrl: 'www.sophiaspath.org/wiki/logical-atomism',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#e3f2fd', border: '#42a5f5' },
        font: { size: 18, color: '#343a40', multi: false },
      },
      {
        id: 2,
        label: 'B. Russell',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Russell.png',
        wikiUrl: 'www.sophiaspath.org/wiki/bertrand-russell',
      },
      {
        id: 3,
        label: 'L. Wittgenstein',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Wittgenstein.png',
        wikiUrl: 'www.sophiaspath.org/wiki/ludwig-wittgenstein',
      },
      {
        id: 4,
        label: 'G. Frege',
        group: 'Logical Atomism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Gottlob-Frege.png',
        wikiUrl: 'www.sophiaspath.org/wiki/gottlob-frege',
      },
      {
        id: 5,
        label: 'Logical Positivism',
        group: 'Logical Positivism',
        shape: 'box',
        wikiUrl: 'www.sophiaspath.org/wiki/logical-positivism',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#fce4ec', border: '#e91e63' },
        font: { size: 18, color: '#343a40' },
      },
      {
        id: 6,
        label: 'Vienna Circle',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Vienna-Circle.png',
        wikiUrl: 'www.sophiaspath.org/wiki/the-vienna-circle',
      },
      {
        id: 7,
        label: 'A.J. Ayer',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'AJ-Ayer.png',
        wikiUrl: 'www.sophiaspath.org/wiki/aj-ayer',
      },
      {
        id: 8,
        label: 'R. Carnap',
        group: 'Logical Positivism',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Carnap.png',
        wikiUrl: 'www.sophiaspath.org/wiki/rudolf-carnap',
      },
      {
        id: 9,
        label: 'Ordinary Language',
        group: 'Ordinary Language Philosophy',
        shape: 'box',
        wikiUrl: 'www.sophiaspath.org/wiki/ordinary-language-philosophy',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#fff9c4', border: '#fbc02d' },
        font: { size: 16, color: '#343a40' },
      },
      {
        id: 10,
        label: 'P.F. Strawson',
        group: 'Ordinary Language Philosophy',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Strawson.png',
        wikiUrl: 'www.sophiaspath.org/wiki/p-f-strawson',
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
        label: 'G. Ryle',
        group: 'Ordinary Language Philosophy',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Ryle.png',
        wikiUrl: 'www.sophiaspath.org/wiki/gilbert-ryle',
      },
      {
        id: 13,
        label: 'Logical Empiricism',
        group: 'Logical Empiricism and its End',
        shape: 'box',
        wikiUrl: 'www.sophiaspath.org/wiki/logical-empricism',
        margin: { top: 30, right: 30, bottom: 30, left: 30 },
        color: { background: '#e8f5e9', border: '#4caf50' },
        font: { size: 16, color: '#343a40' },
      },
      {
        id: 14,
        label: 'W. Quine',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Quine.png',
        wikiUrl: 'www.sophiaspath.org/wiki/willard-van-orman-quine',
      },
      {
        id: 15,
        label: 'W. Sellars',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Sellars.png',
        wikiUrl: 'www.sophiaspath.org/wiki/wilfrid-sellars',
      },
      {
        id: 16,
        label: 'R. Chisholm',
        group: 'Logical Empiricism and its End',
        shape: 'image',
        image: PHILOSOPHER_IMAGE_BASE_URL + 'Chisholm.png',
        wikiUrl: 'www.sophiaspath.org/wiki/roderick-chisholm',
      },
    ],
    []
  );

  // 2) Define edges, including label = 'Influence', 'Objection', 'Resonation' where appropriate
  const edges = useMemo(() => [
    // Keep each philosopher near box
    { from: 1, to: 2, length: 150 },
    { from: 1, to: 3, length: 150 },
    { from: 1, to: 4, length: 150 },
    { from: 5, to: 6, length: 150 },
    { from: 5, to: 7, length: 150 },
    { from: 5, to: 8, length: 150 },
    { from: 9, to: 10, length: 150 },
    { from: 9, to: 11, length: 150 },
    { from: 9, to: 12, length: 150 },
    { from: 13, to: 14, length: 150 },
    { from: 13, to: 15, length: 150 },
    { from: 13, to: 16, length: 150 },

    // 1) Bertrand Russell (2) objects G. Frege (4)
    {
      from: 2,
      to: 4,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },

    // 2) P.F. Strawson (10) objects J.L. Austin (11), Quine (14),
    //    Vienna Circle (6), and Russell (2)
    {
      from: 10,
      to: 11,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },
    {
      from: 10,
      to: 14,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },
    {
      from: 10,
      to: 6,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },
    {
      from: 10,
      to: 2,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },

    // 3) Ludwig Wittgenstein (3) influences Vienna Circle (6)
    {
      from: 3,
      to: 6,
      label: 'Influence',
      arrows: 'to',
      color: { color: 'green' },
    },

    // 4) Vienna Circle (6) objects Rudolf Carnap (8)
    {
      from: 6,
      to: 8,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },

    // 5) Wilfrid Sellars (15) resonates with G. Frege (4) but objects to Russell (2)
    {
      from: 15,
      to: 4,
      label: 'Resonation',
      arrows: 'to',
      color: { color: 'blue' },
    },
    {
      from: 15,
      to: 2,
      label: 'Objection',
      arrows: 'to',
      color: { color: 'red' },
    },

  ], []);

  // 3) Initialize network
  useEffect(() => {
    if (containerRef.current) {
      const options = {
        layout: { hierarchical: false },
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -35,
            centralGravity: 0.005,
            springLength: 200,
            springConstant: 0.08,
          },
          stabilization: { enabled: false },
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

      // Create the network
      const networkInstance = new Network(
        containerRef.current,
        { nodes: initialNodes, edges },
        options
      );
      networkRef.current = networkInstance;

      // D3 zoom if needed
      const svg = d3.select(containerRef.current as HTMLDivElement);
      const zoom: d3.ZoomBehavior<HTMLDivElement, unknown> = d3
        .zoom<HTMLDivElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          svg.selectAll('g').attr('transform', event.transform);
        });
      svg.call(zoom);

      // Show filter button only on node click
      networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
          setShowFilterButton(true);
        } else {
          setShowFilters(false);
          setShowFilterButton(false);
        }
      });

      // Double-click => open wiki if present
      networkInstance.on('doubleClick', (params) => {
        if (params.nodes && params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const nodeData = initialNodes.find((node) => node.id === nodeId);
          if (nodeData && nodeData.wikiUrl) {
            const url = nodeData.wikiUrl.startsWith('http')
              ? nodeData.wikiUrl
              : `https://${nodeData.wikiUrl}`;
            window.open(url, '_blank');
          }
        }
      });
    }
  }, [edges, initialNodes]);

  //
  // 4) Filter by relationship:
  //    Only show edges (and the nodes connected by them) that match the chosen label.
  //    Then zoom in on those nodes.
  //
  const filterByRelationship = (relationship: string | null) => {
    if (!networkRef.current) return;
    const net = networkRef.current;

    // If no relationship => reset to show all
    if (!relationship) {
      net.setData({ nodes: initialNodes, edges });

      // Fit on all nodes:
      const allNodeIds = initialNodes.map((node) => node.id);
      net.fit({
        nodes: allNodeIds,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      });
      return;
    }

    // 1. Find relevant edges
    const relevantEdges = edges.filter((e) => e.label === relationship);

    // 2. Collect node IDs from relevant edges
    const nodeIds = new Set<number>();
    relevantEdges.forEach((edge) => {
      nodeIds.add(edge.from as number);
      nodeIds.add(edge.to as number);
    });
    const nodeIdArray = Array.from(nodeIds);

    // 3. Hide any nodes not in nodeIds
    const filteredNodes = initialNodes.map((node) => ({
      ...node,
      hidden: !nodeIds.has(node.id),
    }));

    // 4. Hide any edges not in relevantEdges
    const filteredEdges = edges.map((edge) => ({
      ...edge,
      hidden: !relevantEdges.includes(edge),
    }));

    // 5. Update the network with the filtered data
    net.setData({ nodes: filteredNodes, edges: filteredEdges });

    // 6. Zoom in on relevant nodes
    net.fit({
      nodes: nodeIdArray,
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad',
      },
    });
  };


  return (
    <div style={{ position: 'relative' }}>
      {/* The container for the graph */}
      <div
        ref={containerRef}
        style={{ height: 'calc(100vh - 180px)', width: '100%', backgroundColor: 'white' }}
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
            flexDirection: 'column',
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
            onClick={() => filterByRelationship('Influence')}
            style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}
          >
            Influence
          </button>
          <button
            onClick={() => filterByRelationship('Objection')}
            style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}
          >
            Objection
          </button>
          <button
            onClick={() => filterByRelationship('Resonation')}
            style={{ backgroundColor: 'blue', color: 'white', padding: '10px' }}
          >
            Resonation
          </button>
          <button
            onClick={() => filterByRelationship(null)} // Show all
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
