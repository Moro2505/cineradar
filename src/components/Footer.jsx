import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="brand-logo">
                        <img src="/logo.png" alt="CineRadar Logo" />
                        <span className="text-gradient">CineRadar</span>
                    </div>
                    <p className="brand-desc">
                        A modern media discovery platform built with React 19 & Appwrite to track popular trends in real-time.
                    </p>
                    <div className="tech-stack">
                        <span>React 19</span>
                        <span>TMDB API</span>
                        <span>Appwrite</span>
                        <span>Tailwind CSS</span>
                    </div>
                </div>

                <div className="footer-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/tv">TV Shows</Link></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h4>Contact & Social</h4>
                    <div className="social-buttons">
                        <a
                            href="https://github.com/Moro2505"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            title="GitHub: Moro2505"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/mohamed-moro-816716375"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            title="LinkedIn Profile"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                        </a>

                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=mohammedmoro2005@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            title="mohammedmoro2005@gmail.com"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-11.174l4.623 5.462zm1.52 1.309l3.857 4.554 3.857-4.554 5.766 6.962h-19.246l5.766-6.962zm9.234-1.309l4.623-5.462v11.174l-4.623-5.712zm-9.352-2.146l-6.025-7.119h19.996l-6.025 7.119-3.973-4.693-3.973 4.693z" />
                            </svg>
                            Email
                        </a>

                        <a
                            href="https://wa.me/201064273242"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn"
                            title="+20 106 427 3242"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.26-1.116z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 CineRadar. Portfolio Project.</p>
                <div className="tmdb-attribution">
                    <svg className="tmdb-logo" viewBox="0 0 186.04 125.22" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#0d253f" d="M0 0h186.04v125.22H0z" />
                        <path fill="#01b4e4" d="M24.78 40.85h25.43v43.52H24.78zM61.81 40.85h17.9v43.52h-17.9zM91.35 40.85h25.43v43.52H91.35zM128.38 40.85h32.88v10.5h-21.43v6.05h19.86v9.84h-19.86v6.62h21.43v10.51h-32.88z" />
                        <path fill="#90cea1" d="M141.5 24.3h22v9.5h-22z" />
                    </svg>
                    <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;