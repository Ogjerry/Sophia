'use client';
import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';

const GraphPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [nodes, setNodes] = useState([
    { id: 1, label: 'Plato', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: "Greek" },
    { id: 2, label: 'Aristotle', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: "Greek" },
    { id: 3, label: 'Juno', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: "Roman" },
    { id: 4, label: 'Meta', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: "Roman" },
    { id: 5, label: 'Node 2', shape: 'dot', color: { border: '#000000', background: '#ffffff' }, size: 20, group: "Other" },
  ]);

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 5 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
  ];

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

      const networkInstance = new Network(containerRef.current, { nodes, edges }, options);
      setNetwork(networkInstance);
    }
  }, []);

  // Filter function
  const filterGraph = (group: string) => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      hidden: group !== '' && node.group !== group,
    }));
    setNodes(updatedNodes); // Update state with filtered nodes
    network?.setData({ nodes: updatedNodes, edges });
  };

  return (
    <div>
      <div ref={containerRef} style={{ height: '600px', backgroundColor: 'white' }} />
      <button onClick={() => filterGraph('Greek')}>Show Greek</button>
      <button onClick={() => filterGraph('Roman')}>Show Roman</button>
      <button onClick={() => filterGraph('')}>Show All</button>
    </div>
  );
};

export default GraphPage;
