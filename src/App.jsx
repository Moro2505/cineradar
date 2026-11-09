import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));
const MediaDetails = lazy(() => import('./pages/MediaDetails'));

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <main className="relative bg-primary min-h-screen text-white overflow-x-hidden">
                <div className="pattern" />
                
                <Navbar />
                <Suspense fallback={
                    <div className="min-h-[70vh] flex justify-center items-center">
                        <Spinner />
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/tv" element={<TVShows />} />
                        <Route path="/:mediaType/:id" element={<MediaDetails />} />
                    </Routes>
                </Suspense>
                <Footer />
            </main>
        </BrowserRouter>
    );
};

export default App;