import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { Tours } from './pages/Tours';
import { Explorers } from './pages/Explorers';
import { MapsUnwrapped } from './pages/MapsUnwrapped';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="tours"
              element={
                <ProtectedRoute>
                  <Tours />
                </ProtectedRoute>
              }
            />
            <Route
              path="explorers"
              element={
                <ProtectedRoute>
                  <Explorers />
                </ProtectedRoute>
              }
            />
            <Route
              path="unwrapped"
              element={
                <ProtectedRoute>
                  <MapsUnwrapped />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;