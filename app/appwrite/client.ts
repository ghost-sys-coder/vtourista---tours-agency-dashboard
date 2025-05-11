import { Account, Client, Databases, Storage } from "appwrite";
export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
}

// Checking for missing environment variables
for (const [key, value] of Object.entries(appwriteConfig)) {
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`)
    }
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);


export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);