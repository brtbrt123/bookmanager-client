import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, BookOpen, LogOut } from 'lucide-react';

export default function BookListScreen({ onLogout }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://127.0.0.1:8000/api/books');
        setBooks(response.data);
      } catch {
        setError('Failed to fetch books from server. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">Book Catalog</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 font-medium transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading catalog...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-base">No books added yet.</p>
            <p className="text-slate-400 text-sm mt-1">Tap the plus button below to add your first book.</p>
          </div>
        )}

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/books/${book.id}`)}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-slate-800 line-clamp-1">{book.title}</h2>
              <p className="text-sm text-slate-600 mt-1">by <span className="font-medium">{book.author}</span></p>
              <span className="inline-block mt-3 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
                {book.genre}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => navigate('/add-book')}
        aria-label="Add Book"
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
      </button>
    </div>
  );
}