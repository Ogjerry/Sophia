'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Network } from 'vis-network';
import * as d3 from 'd3';

const GraphPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null); // Declare networkRef here to store the network instance
  const [showFilters, setShowFilters] = useState(false); // filter at the right top corner
  const [showFilterButton, setShowFilterButton] = useState(false); // State for showing/hiding the filter toggle button

  const initialNodes = useMemo(() => [
    // Logical Atomism (Category Frame)
    {
      id: 1,
      label: "Logical Atomism",
      shape: "box",
      fixed: true,
      x: -400,
      y: 0,
      color: { background: "#e3f2fd", border: "#42a5f5" },
      widthConstraint: 400,
      heightConstraint: 300,
      level: 1,
      group: "Logical Atomism", // Group for filtering
    },
    // Logical Atomism Philosophers
    {
      id: 2,
      label: "Bertrand Russell",
      shape: "image",
      image: "media/Russell.png",
      level: 2,
      fixed: true,
      x: -500,
      y: -100,
      group: "Logical Atomism", // Group for filtering
    },
    {
      id: 3,
      label: "Ludwig Wittgenstein",
      shape: "image",
      image: "media/Wittgenstein.png",
      level: 2,
      fixed: true,
      x: -400,
      y: 0,
      group: "Logical Atomism", // Group for filtering
    },
    {
      id: 4,
      label: "Gottlob Frege",
      shape: "image",
      image: "media/Frege.png",
      level: 2,
      fixed: true,
      x: -300,
      y: 100,
      group: "Logical Atomism", // Group for filtering
    },
  
    // Logical Positivism (Category Frame)
    {
      id: 5,
      label: "Logical Positivism",
      shape: "box",
      fixed: true,
      x: 200,
      y: 0,
      color: { background: "#fce4ec", border: "#e91e63" },
      widthConstraint: 400,
      heightConstraint: 300,
      level: 1,
      group: "Logical Positivism", // Group for filtering
    },
    // Logical Positivism Philosophers
    {
      id: 6,
      label: "Vienna Circle",
      shape: "image",
      image: "media/Vienna Circle.png",
      level: 2,
      fixed: true,
      x: 100,
      y: -100,
      group: "Logical Positivism", // Group for filtering
    },
    {
      id: 7,
      label: "A.J. Ayer",
      shape: "image",
      image: "media/AJ-Ayer.png",
      level: 2,
      fixed: true,
      x: 200,
      y: 0,
      group: "Logical Positivism", // Group for filtering
    },
    {
      id: 8,
      label: "Rudolf Carnap",
      shape: "image",
      image: "media/Carnap.png",
      level: 2,
      fixed: true,
      x: 300,
      y: 100,
      group: "Logical Positivism", // Group for filtering
    },
  
    // Ordinary Language Philosophy (Category Frame)
    {
      id: 9,
      label: "Ordinary Language Philosophy",
      shape: "box",
      fixed: true,
      x: 800,
      y: 0,
      color: { background: "#fff9c4", border: "#fbc02d" },
      widthConstraint: 400,
      heightConstraint: 300,
      level: 1,
      group: "Ordinary Language Philosophy", // Group for filtering
    },
    // Ordinary Language Philosophy Philosophers
    {
      id: 10,
      label: "P.F. Strawson",
      shape: "image",
      image: "media/Strawson.png",
      level: 2,
      fixed: true,
      x: 700,
      y: -100,
      group: "Ordinary Language Philosophy", // Group for filtering
    },
    {
      id: 11,
      label: "J.L. Austin",
      shape: "image",
      image: "media/Austin.png",
      level: 2,
      fixed: true,
      x: 800,
      y: 0,
      group: "Ordinary Language Philosophy", // Group for filtering
    },
    {
      id: 12,
      label: "Gilbert Ryle",
      shape: "image",
      image: "media/Ryle.png",
      level: 2,
      fixed: true,
      x: 900,
      y: 100,
      group: "Ordinary Language Philosophy", // Group for filtering
    },
  
    // Logical Empiricism and Its End (Category Frame)
    {
      id: 13,
      label: "Logical Empiricism and its End",
      shape: "box",
      fixed: true,
      x: 1400,
      y: 0,
      color: { background: "#e8f5e9", border: "#4caf50" },
      widthConstraint: 400,
      heightConstraint: 300,
      level: 1,
      group: "Logical Empiricism and its End", // Group for filtering
    },
    // Logical Empiricism Philosophers
    {
      id: 14,
      label: "Willard Van Orman Quine",
      shape: "image",
      image: "media/Quine.png",
      level: 2,
      fixed: true,
      x: 1300,
      y: -100,
      group: "Logical Empiricism and its End", // Group for filtering
    },
    {
      id: 15,
      label: "Wilfrid Sellars",
      shape: "image",
      image: "media/Sellars.png",
      level: 2,
      fixed: true,
      x: 1400,
      y: 0,
      group: "Logical Empiricism and its End", // Group for filtering
    },
    {
      id: 16,
      label: "Roderick Chisholm",
      shape: "image",
      image: "media/Chisholm.png",
      level: 2,
      fixed: true,
      x: 1500,
      y: 100,
      group: "Logical Empiricism and its End", // Group for filtering
    },
  ], []); // Empty array to only initialize once
  

  const edges = useMemo(() =>[
    // Logical Atomism connections
    { from: 1, to: 5, label: "Objection", arrows: "to", color: { color: "red" } },
    { from: 5, to: 6, label: "Influence", arrows: "to", color: { color: "green" } },
    { from: 5, to: 7, label: "Objection", arrows: "to", color: { color: "red" } },
  
    // Logical Positivism connections
    { from: 2, to: 8, label: "Originates", arrows: "to", color: { color: "blue" } },
    { from: 8, to: 9, label: "Objection", arrows: "to", color: { color: "red" } },
  
    // Ordinary Language Philosophy connections
    { from: 3, to: 10, label: "Develops", arrows: "to", color: { color: "blue" } },
    { from: 3, to: 11, label: "Influence", arrows: "to", color: { color: "green" } },
    { from: 3, to: 12, label: "Objection", arrows: "to", color: { color: "red" } },
  
    // Logical Empiricism and its End connections
    { from: 4, to: 13, label: "Resonation", arrows: "to", color: { color: "blue" } },
    { from: 4, to: 14, label: "Resonation", arrows: "to", color: { color: "blue" } },
    { from: 4, to: 15, label: "Objection", arrows: "to", color: { color: "red" } },
  ], []);// Empty array to only initialize once

  // Initialize network and D3 zoom
  useEffect(() => {
    if (containerRef.current) {
      const options = {
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'LR', // Left-to-right layout
            sortMethod: 'directed',
            nodeSpacing: 150,
            levelSeparation: 200,
          },
        },
        nodes: {
          borderWidth: 2,
          shadow: true,
          font: { size: 16, color: '#343a40' },
        },
        edges: {
          color: { color: '#848484', highlight: '#ff0000' },
          width: 2,
        },
        physics: {
          enabled: true,
        },
      };

      const networkInstance = new Network(containerRef.current, { nodes: initialNodes, edges }, options);
      networkRef.current = networkInstance; // Store the network instance in the ref

      // Now apply D3 zoom functionality to containerRef
      const svg = d3.select(containerRef.current as HTMLDivElement); // Explicitly type as HTMLDivElement
      const zoom: d3.ZoomBehavior<HTMLDivElement, unknown> = d3.zoom<HTMLDivElement, unknown>() // Specify the element type
        .scaleExtent([0.1, 4]) // Set the zoom limits
        .on('zoom', (event) => {
          // Apply zoom transformation
          svg.selectAll('g').attr('transform', event.transform);
        });

      svg.call(zoom); // Apply zoom to the container

      // set filters default mode
      networkInstance.on('click', (params) => {
        if (params.nodes.length > 0) {
          setShowFilterButton(true);
        } else {                      // if clicking on white space
          setShowFilters(false);      // filter disappear
          setShowFilterButton(false); // options disappear
        }
      })
    }
  }, [edges, initialNodes]);

  // Filter function
  const filterGraph = (group: string) => {
    if (networkRef.current) {
      const filteredNodes = initialNodes.map((node) => ({
        ...node,
        hidden: group !== '' && node.group !== group, // Hide nodes that don't match the selected group
      }));

      networkRef.current.setData({ nodes: filteredNodes, edges }); // Update the network with filtered nodes
    }
  };
  

  return (
    <div style={{ position: 'relative' }}>
      {/* The container for the graph */}
      <div ref={containerRef} style={{ height: '600px', width: '100%', backgroundColor: 'white' }} />

      {/* Toggle button to show filters */}
      {/* Control Flow: Click Nodes  ->  Filter Appear  ->  Click Filter  ->  Filter Options Appear */}
      {showFilterButton && (
        <div
          style={{
            position: 'absolute',
            top     : '10px',
            right   : '10px',
            zIndex  : 10
          }}
        >
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{ backgroundColor: 'black', color: 'white', padding: '10px', cursor: 'pointer' } }
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
            style={{ backgroundColor: 'black', color: 'white', padding: '10px'}}
          >
            Greek
          </button>
          <button 
            onClick={() => filterGraph('Logical Positivism')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Roman
          </button>
          <button 
            onClick={() => filterGraph('Ordinary Language Philosophy')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Other
          </button>
          <button 
            onClick={() => filterGraph('Logical Empiricism and its End')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            All
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphPage;