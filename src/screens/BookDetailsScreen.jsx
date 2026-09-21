import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BookDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#64748b' }}>
        Loading book details...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate('/books')} style={styles.backBtn}>
            &larr; Back to Books
          </button>
          <span style={styles.brandTitle}>BookManager</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>{book.genre}</span>
            <span style={styles.idLabel}>ID #{book.id}</span>
          </div>

          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>Written by <strong style={{ color: '#0f172a' }}>{book.author}</strong></p>

          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Genre / Category</span>
              <span style={styles.infoValue}>{book.genre}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Database Reference</span>
              <span style={styles.infoValue}>record_{book.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  headerContent: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  brandTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
  },
  main: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '0 24px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '32px',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  badge: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
    padding: '4px 10px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '4px',
  },
  idLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  author: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0 0 28px 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
  },
};