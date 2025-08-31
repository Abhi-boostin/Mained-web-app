"use client";

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SearchInput({ query, onQueryChange, onSubmit, loading }: SearchInputProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for songs..."
          className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-50"
        >
          🔍
        </button>
      </form>
    </div>
  );
} 