import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
    try {
        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollectionId,
            [Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')]
        );

        if (total === 0) {
            console.log("No trips found!");
            return {total: 0, allTrips: []};
        }

        return { total, allTrips: documents}
    } catch (error) {
        console.log("getAllTrips error:", error);
    }
}


// fetch single trip by id
export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId,
        tripId
    );

    if (!trip.$id) {
        console.log("Trip not found!");
        return null;
    }

    return trip;
}