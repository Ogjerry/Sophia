'use client';
import Link from 'next/link';

const FrontPage = () => {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f0f0f0', 
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Title */}
      <h1 style={{ fontSize: '3rem', color: '#343a40', marginBottom: '20px' }}>
        Welcome to the Interactive Graph Explorer
      </h1>

      {/* Brief introduction */}
      <p style={{ fontSize: '1.5rem', color: '#555', maxWidth: '800px', lineHeight: '1.6' }}>
        This website allows you to explore dynamic and interactive networks. 
        Click on nodes to view filters, zoom into specific parts of the network, 
        and export your network data. Start by exploring the graph or learning 
        more about the relationships between different entities.
      </p>

      {/* Navigation Button */}
      <Link href="/graph">
        <button style={{
          marginTop: '30px',
          backgroundColor: 'black',
          color: 'white',
          padding: '15px 30px',
          fontSize: '1.2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          border: 'none'
        }}>
          Explore the Graph
        </button>
      </Link>
    </div>
  );
};

export default FrontPage;
