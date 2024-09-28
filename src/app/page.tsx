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
    { id: 1, label: 'Plato', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Greek' },
    { id: 2, label: 'Aristotle', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Greek' },
    { id: 3, label: 'Juno', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Roman' },
    { id: 4, label: 'Node 1', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Roman' },
    { id: 5, label: 'Node 2', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Other' },
  ], []);// Empty array to only initialize once

  const edges = useMemo(() =>[
    { from: 1, to: 2 },
    { from: 1, to: 5 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ], []);// Empty array to only initialize once

  // Initialize network and D3 zoom
  useEffect(() => {
    if (containerRef.current) {
      const options = {
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
            onClick={() => filterGraph('Greek')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px'}}
          >
            Greek
          </button>
          <button 
            onClick={() => filterGraph('Roman')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Roman
          </button>
          <button 
            onClick={() => filterGraph('Other')}
            style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}
          >
            Other
          </button>
          <button 
            onClick={() => filterGraph('')}
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