'use client';
import { useState } from 'react';

const WikiPage = () => {
  const [content, setContent] = useState('Welcome to the Wiki Page!');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wiki Page</h1>
      <p>{content}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setContent('You clicked the button!')}
      >
        Click Me
      </button>
    </div>
  );
};

export default WikiPage;
