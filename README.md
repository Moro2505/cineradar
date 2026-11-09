# CineRadar - Media Discovery Web Application

CineRadar is a modern, responsive web application designed for exploring trending movies and TV shows. It integrates with The Movie Database (TMDB) API for fetching media content and leverages Appwrite Cloud as a Backend-as-a-Service (BaaS) to track and rank global search metrics in real-time.

---

## Live Demo

Website Link: [https://cineradar-rust.vercel.app](https://cineradar-rust.vercel.app)

---

## Key Features

- **Trending & Popular Media:** Real-time updates for trending movies, top-rated TV series, and popular releases.
- **Appwrite Search Tracking:** Custom backend logic powered by Appwrite Databases that increments search metrics and ranks community trends upon navigating to a media details page.
- **Real-Time Debounced Search:** Interactive search bar utilizing debounced input handling to optimize API query performance across movies, TV series, and cast members.
- **Genre Filtering & Catalog Exploration:** Smooth multi-category filtering for broad catalogues.
- **Embedded Trailers & Modals:** Integrated YouTube trailer player within media details modals.
- **Actor Filmography Exploration:** Complete cast biographies, personal profiles, and top known works accessible without page reloads.
- **Optimized UI & Loading States:** Built using Tailwind CSS alongside nested CSS styling patterns, featuring skeleton loading UI components and full screen responsiveness.

---

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM v6
- **Styling:** Tailwind CSS, Custom Nested CSS
- **Backend as a Service (BaaS):** Appwrite Cloud (Databases & Query APIs)
- **External Data Source:** TMDB (The Movie Database) REST API
- **Deployment & Hosting:** Vercel

---

## Environment Variables Setup

Create a `.env.local` file in the root directory of the project and configure the following environment keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
VITE_APPWRITE_ENDPOINT=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)