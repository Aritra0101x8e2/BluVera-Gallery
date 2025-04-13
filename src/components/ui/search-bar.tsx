
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchItems, VaultItemType } from '@/lib/storage';

interface SearchBarProps {
  onSelect: (item: VaultItemType) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VaultItemType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of the search component
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const items = searchItems(query);
      setResults(items);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (item: VaultItemType) => {
    onSelect(item);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-vault-oceanBlue" />
        </div>
        <input
          type="text"
          className="vault-input pl-10 w-full"
          placeholder="Search notes, images, PDFs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-black border border-vault-oceanBlue/30 rounded-xl shadow-blue-glow-sm z-50 max-h-80 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.id}
              className="p-3 hover:bg-vault-deepBlue/40 cursor-pointer border-b border-vault-oceanBlue/20 last:border-b-0"
              onClick={() => handleSelect(item)}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" 
                  style={{ 
                    backgroundColor: 
                      item.type === 'note' ? '#0EA5E9' : 
                      item.type === 'image' ? '#22c55e' : '#f97316' 
                  }}
                />
                <span className="font-medium text-white truncate mr-2">{item.title}</span>
                <span className="text-xs text-gray-400 ml-auto">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
