import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function BookDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/books/${id}`);
        setBook(response.data);
      } catch  {
        setError('Book not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        {loading && (
          <div className="py-12 text-center text-slate-500">Loading book details...</div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {book && !loading && (
          <div>
            <div className="border-b border-slate-100 pb-4 mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                {book.genre}
              </span>
              <h1 className="text-2xl font-bold text-slate-800 mt-1">{book.title}</h1>
              <p className="text-base text-slate-600 mt-1">
                Written by <span className="font-semibold text-slate-800">{book.author}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 pt-2">
              <div>
                <p className="font-medium text-slate-400">Database ID</p>
                <p className="text-slate-700 font-mono mt-0.5">#{book.id}</p>
              </div>
              <div>
                <p className="font-medium text-slate-400">Date Added</p>
                <p className="text-slate-700 mt-0.5">
                  {book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}