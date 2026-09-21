import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', author: '', genre: '' });
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8000/api/books');
        if (!res.ok) {
          throw new Error('Failed to fetch books from the server.');
        }
        const data = await res.json();
        if (isMounted) {
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to connect to API');
          console.error('Error fetching books:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const startEdit = (e, book) => {
    e.stopPropagation();
    setEditingBook(book.id);
    setEditForm({ title: book.title, author: book.author, genre: book.genre });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/books/${editingBook}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setEditingBook(null);
      }
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Top App Bar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>BookManager</h1>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/login';
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        <div style={styles.metaRow}>
          <h2 style={styles.pageTitle}>Collection</h2>
          <span style={styles.countBadge}>
            {books.length} {books.length === 1 ? 'Book' : 'Books'}
          </span>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading book catalog...</p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorTitle}>Error Loading Books</p>
            <p style={styles.errorMessage}>{error}</p>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && books.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No books found in the collection.</p>
            <p style={styles.emptySubtext}>Use the + button below to add your first book.</p>
          </div>
        )}

        {/* 4. Book Grid */}
        {!loading && !error && books.length > 0 && (
          <div style={styles.grid}>
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/books/${book.id}`)}
                style={styles.card}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.genreBadge}>{book.genre}</span>
                  <div style={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => startEdit(e, book)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, book.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h3 style={styles.bookTitle}>{book.title}</h3>
                <p style={styles.bookAuthor}>by {book.author}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.idLabel}>ID #{book.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => navigate('/add-book')}
        style={styles.fab}
        title="Add New Book"
      >
        +
      </button>

      {/* Edit Modal */}
      {editingBook && (
        <div style={styles.modalOverlay} onClick={() => setEditingBook(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Book</h3>
            <form onSubmit={handleUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Author</label>
                <input
                  type="text"
                  required
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Genre</label>
                <input
                  type="text"
                  required
                  value={editForm.genre}
                  onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.modalButtons}>
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#0f172a',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#0f172a',
  },
  logoutBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    color: '#475569',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 24px 100px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  countBadge: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 0',
    color: '#64748b',
  },
  loadingText: {
    fontSize: '15px',
    fontWeight: '500',
    margin: 0,
  },
  errorContainer: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#dc2626',
  },
  errorTitle: {
    margin: '0 0 4px 0',
    fontWeight: '600',
    fontSize: '15px',
  },
  errorMessage: {
    margin: 0,
    fontSize: '13px',
    color: '#b91c1c',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  genreBadge: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '3px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  cardActions: {
    display: 'flex',
    gap: '6px',
  },
  editBtn: {
    padding: '3px 8px',
    fontSize: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#334155',
  },
  deleteBtn: {
    padding: '3px 8px',
    fontSize: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#dc2626',
  },
  bookTitle: {
    margin: '0 0 6px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: '1.4',
  },
  bookAuthor: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#64748b',
  },
  cardFooter: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '12px',
  },
  idLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 0',
    backgroundColor: '#ffffff',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#334155',
    margin: '0 0 4px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  fab: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '52px',
    height: '52px',
    borderRadius: '26px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '28px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    fontWeight: '700',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '8px 14px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#475569',
  },
  saveBtn: {
    padding: '8px 14px',
    backgroundColor: '#0f172a',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#ffffff',
  },
};