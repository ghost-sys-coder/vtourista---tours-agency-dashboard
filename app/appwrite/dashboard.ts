import { parseTripData } from "lib/utils";
import { appwriteConfig, database } from "./client";


interface Document {
    [key: string]: any;
}

type FilterByDate = (
    items: Document[],
    key: string,
    start: string,
    end?: string,
) => number;



// filterByDate function filters the items based on the date range provided
const filterByDate: FilterByDate = (items, key, start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(); //use today's date if no end date is provided

    return items.filter(item => {
        const itemDate = new Date(item[key]);
        return itemDate >= startDate && itemDate <= endDate;
    }).length;
}

export const getUsersAndTripStarts = async (): Promise<DashboardStats> => {
    const d = new Date();
    const startCurrent = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    const startPrev = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString();
    const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();


    const [users, trips] = await Promise.all([
        await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
        ),
        await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollectionId
        )
    ])


    // filter users by role -- admin or user
    const filterUsersByRole = (role: string) => {
        return users.documents.filter(user => user.status === role);
    }

    const usersCurrentMonth = filterByDate(users.documents, "joinedAt", startCurrent, undefined);
    const usersPreviuosMonth = filterByDate(users.documents, "joinedAt", startPrev, endPrev);

    const tripsCurrentMonth = filterByDate(trips.documents, "createdAt", startCurrent, undefined);
    const tripsPreviousMonth = filterByDate(trips.documents, "createdAt", startPrev, endPrev);

    return {
        totalUsers: users.total,
        usersJoined: {
            currentMonth: usersCurrentMonth,
            lastMonth: usersPreviuosMonth
        },
        totalTrips: trips.total,
        tripsCreated: {
            currentMonth: tripsCurrentMonth,
            lastMonth: tripsPreviousMonth
        },
        userRole: {
            total: filterUsersByRole("user").length,
            currentMonth: filterByDate(filterUsersByRole("user"), "joinedAt", startCurrent, undefined),
            lastMonth: filterByDate(filterUsersByRole("user"), "joinedAt", startPrev, endPrev)
        }
    }


}


export const getUserGrowthPerDay = async () => {
    const users = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
    );

    const userGrowth = users.documents.reduce(
        (acc: { [key: string]: number }, user: Document) => {
            const date = new Date(user.joinedAt);
            const day = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        },
        {}
    );

    return Object.entries(userGrowth).map(([day, count]) => ({
        count: Number(count),
        day,
    }));
};


export const getTripsCreatedPerDay = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId
    );

    const tripsCreated = trips.documents.reduce(
        (accumulator: { [key: string]: number }, trip: Document) => {
            const date = new Date(trip.createdAt);
            const day = date.toLocaleTimeString("en-US", {
                month: "short",
                day: "numeric"
            });
            accumulator[day] = (accumulator[day] || 0) + 1;
            return accumulator;
        }, {}
    );

    return Object.entries(tripsCreated).map(([day, count]) => ({
        count: Number(count),
        day
    }))
}


export const getTripsByTravelStyle = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId
    );

    const travelStyleCounts = trips.documents.reduce(
        (acc: { [key: string]: number }, trip: Document) => {
            const tripDetail = parseTripData(trip.tripDetail);

            if (tripDetail && tripDetail.travelStyle) {
                const travelStyle = tripDetail.travelStyle;
                acc[travelStyle] = (acc[travelStyle] || 0) + 1;
            };

            return acc;
        }, {}
    );

    return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
        travelStyle,
        count: Number(count)
    }));
}
