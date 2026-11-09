import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const database = new Databases(client);

export const updateMediaVisitCount = async (media) => {
  if (!media || !media.id) return;

  const mediaId = String(media.id);
  const mediaType = media.media_type || (media.title ? 'movie' : 'tv');
  const title = media.title || media.name || '';
  
  const posterUrl = media.poster_path 
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('media_id', mediaId),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      const currentCount = typeof doc.count === 'number' ? doc.count : 0;

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: currentCount + 1,
        title: title,
        media_type: mediaType,
        poster_url: posterUrl,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        media_id: mediaId,
        title: title,
        media_type: mediaType,
        count: 1,
        poster_url: posterUrl,
      });
    }
  } catch (error) {
    console.error(`[Appwrite Error] Failed to update visit count for "${title}":`, error);
  }
};

export const getMostSearchedMedia = async (limit = 20, mediaType = null) => {
  try {
    const queries = [
      Query.orderDesc("count"),
      Query.limit(limit || 20)
    ];

    if (mediaType) {
      queries.push(Query.equal("media_type", mediaType));
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    let docs = result.documents || [];

    if (mediaType) {
      docs = docs.filter(item => item.media_type === mediaType);
    }

    return docs.slice(0, limit);
  } catch (error) {
    console.warn("[Appwrite Warning] Error fetching most searched:", error.message);
    return [];
  }
};