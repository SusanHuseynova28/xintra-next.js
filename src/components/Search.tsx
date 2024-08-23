import React from 'react';

interface SearchProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ query, onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default Search;
