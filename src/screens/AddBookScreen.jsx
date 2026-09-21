import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

export default function AddBookScreen() {
  const [formData, setFormData] = useState({ title: '', author: '', genre: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation for empty fields
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim()) {
      setError('All fields are required. Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('http://127.0.0.1:8000/api/books', formData);
      navigate('/books');
    } catch {
      setError('Failed to save book record. Check your backend status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Catalog
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Book</h1>

        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Clean Code"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Robert C. Martin"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. Software Engineering"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition mt-4"
          >
            {isSubmitting ? 'Saving...' : 'Save Book'}
          </button>
        </form>
      </div>
    </div>
  );
}