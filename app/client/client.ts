import { Account, Client, Databases, Storage } from "appwrite";
export const appWriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
}


const client = new Client()
    .setEndpoint(appWriteConfig.endpointUrl)
    .setProject(appWriteConfig.projectId);


export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);