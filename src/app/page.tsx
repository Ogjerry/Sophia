'use client';
import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import * as d3 from 'd3';

const GraphPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null); // Declare networkRef here to store the network instance

  const initialNodes = [
    { id: 1, label: 'Plato', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Greek' },
    { id: 2, label: 'Aristotle', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Greek' },
    { id: 3, label: 'Juno', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Roman' },
    { id: 4, label: 'Node 1', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Roman' },
    { id: 5, label: 'Node 2', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: 'Other' },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 5 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ];

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
    }
  }, []);

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
  
      {/* The container for the buttons */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'absolute', 
          top: '6px', 
          left: '6px', 
          right: '6px', // Ensures full width
          zIndex: 10, 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          padding: '10px', 
          textAlign: 'center', 
          gap: '10px',
          width: 'calc(100% - 20px)' // Ensures buttons take full width minus padding
        }}
      >
        <button 
          onClick={() => filterGraph('Greek')}
          style={{ backgroundColor: 'black', flexGrow: 1, color: 'white', padding: '2px'}}
        >
          Greek
        </button>
  
        <button 
          onClick={() => filterGraph('Roman')}
          style={{ backgroundColor: 'black', flexGrow: 1, color: 'white', padding: '2px' }}
        >
          Roman
        </button>
  
        <button 
          onClick={() => filterGraph('Other')}
          style={{ backgroundColor: 'black', flexGrow: 1, color: 'white', padding: '2px' }}
        >
          Other
        </button>
  
        <button 
          onClick={() => filterGraph('')}
          style={{ backgroundColor: 'black', flexGrow: 1, color: 'white', padding: '2px' }}
        >
          All
        </button>
  
      </div>
    </div>
  );
  
  
};

export default GraphPage;
