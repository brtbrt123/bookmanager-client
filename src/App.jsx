import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import BookListScreen from './screens/BookListScreen';
import AddBookScreen from './screens/AddBookScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginScreen onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Navigate to="/books" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BookListScreen onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AddBookScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BookDetailsScreen />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}