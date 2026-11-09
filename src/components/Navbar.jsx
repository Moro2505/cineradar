import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import NavbarSearch from './NavbarSearch.jsx';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <Link to="/" className="brand-logo">
                    <img src="/logo.png" alt="CineRadar Logo" />
                    <span className="text-gradient">CineRadar</span>
                </Link>

                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-slate-300 hover:text-white bg-slate-900/80 rounded-xl border border-slate-800 active:scale-95 transition"
                        aria-label="Toggle Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-slate-300 hover:text-white bg-slate-900/80 rounded-xl border border-slate-800 active:scale-95 transition"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className={`w-full md:w-auto ${isSearchOpen ? 'block' : 'hidden md:block'}`}>
                <NavbarSearch />
            </div>

            <ul className={`nav-links ${isMenuOpen ? 'flex' : 'hidden md:flex'}`}>
                <li>
                    <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/movies" onClick={() => setIsMenuOpen(false)}>Movies</NavLink>
                </li>
                <li>
                    <NavLink to="/tv" onClick={() => setIsMenuOpen(false)}>TV Shows</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;