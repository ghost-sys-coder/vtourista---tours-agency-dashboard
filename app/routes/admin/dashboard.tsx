import React from 'react'
import {Header, StatsCard, TripCard} from "universal-components";
import type { Route } from './+types/dashboard';
import { getAllUsers, getUser } from '@/appwrite/auth';
import {
    getUsersAndTripStarts, getUserGrowthPerDay,
    getTripsCreatedPerDay, getTripsByTravelStyle
} from '@/appwrite/dashboard';
import { getAllTrips } from '@/appwrite/trips';
import { parseTripData } from 'lib/utils';
import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel, SeriesCollectionDirective, SeriesDirective,
    SplineAreaSeries,
    Tooltip
} from "@syncfusion/ej2-react-charts";
import {ColumnDirective, ColumnsDirective, GridComponent, Inject} from "@syncfusion/ej2-react-grids";
import { interests, tripXAxis, tripYAxis, userXAxis, userYAxis } from '@/constants';


export const clientLoader = async () => {
    const [user, dashboardStats, allTrips, allUsers, userGrowth, tripsCreatedPerDay, tripsByTravelStyle] = await Promise.all([
        await getUser(),
        await getUsersAndTripStarts(),
        await getAllTrips(4, 0),
        await getAllUsers(4, 0),
        await getUserGrowthPerDay(),
        await getTripsCreatedPerDay(),
        await getTripsByTravelStyle(),
    ]);

    const trips = allTrips?.allTrips?.map(({ $id, tripDetail, imageUrls}) => ({
        id: $id,
        imageUrls: imageUrls ?? [],
        ...parseTripData(tripDetail)
    }))

    const mappedUsers: UsersItineraryCount[] = Array.isArray(allUsers) ? allUsers.users.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    })) : [];

    return {
        user,
        dashboardStats,
        allTrips: trips,
        allUsers: mappedUsers,
        userGrowth,
        tripsCreatedPerDay,
        tripsByTravelStyle
    }
};


const Dashboard = ({loaderData}: Route.ComponentProps) => {
    const user = loaderData.user as unknown as User || null;

    const { dashboardStats, allTrips, userGrowth, tripsCreatedPerDay, tripsByTravelStyle } = loaderData;


    const trips = allTrips?.map(trip => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interests: trip.interests
    }));

    const usersAndTrips = [
        {
            title: 'Latest User Signups',
            dataSource: user,
            field: 'count',
            headerText: "Trips Created"
        },
        {
            title: 'Trips based on interest',
            dataSource: trips,
            field: 'interest',
            headerText: 'Interests'
        }
    ]

    // destructure data
    
    const {
        userRole,
        tripsCreated,
        totalTrips,
        totalUsers,
        usersJoined
     } = dashboardStats;

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ? user?.name : "Guest"} 👋`}
                description={"Track activity, trends and popular destinations"}
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <StatsCard
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                        headerTitle="Total Users"
                    />
                    <StatsCard
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                        headerTitle="Total Trips"
                    />
                    <StatsCard
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                        headerTitle="Active Users"
                    />
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <section className="container">
                    <h1 className="text-xl font-semibold text-dark-600">Created Trips</h1>

                    <div className="trip-grid">
                        {allTrips?.slice(0, 4).map(({id, name, imageUrls, estimatedPrice, itinerary, travelStyle, interests}) => (
                            <TripCard
                                key={id}
                                name={name || ""}
                                imageUrl={imageUrls}
                                tags={[travelStyle ?? "", interests ?? ""]}
                                location={itinerary?.[0]?.location ?? ""}
                                id={id.toString()}
                                price={estimatedPrice ? estimatedPrice : "N/A"}
                            />
                        ))}
                    </div>
                </section>
            </section>

            <section className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <ChartComponent
                    id='chart-1'
                    primaryXAxis={userXAxis}
                    primaryYAxis={userYAxis}
                    title='User Growth'
                    tooltip={{ enable: true }}
                    width='100%'
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />

                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName='day'
                            yName='count'
                            name='Column'
                            type='Column'
                            columnWidth={0.3}
                            fill='#00bfff'
                            cornerRadius={{topLeft: 10, topRight: 10}}
                        />
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName='day'
                            yName='count'
                            name='Wave'
                            type='SplineArea'
                            fill="rgba(71, 132, 238, 0.3)"
                            border={{color: "#4784EE", width: 2}}
                        />
                        
                    </SeriesCollectionDirective>
                </ChartComponent>
                
                <ChartComponent
                    id='chart-2'
                    primaryXAxis={tripXAxis}
                    primaryYAxis={tripYAxis}
                    title='Trips Created'
                    tooltip={{ enable: true }}
                    width='100%'
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />

                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={tripsByTravelStyle}
                            xName='travelStyle'
                            yName='count'
                            name='Column'
                            type='Column'
                            columnWidth={0.3}
                            fill='#00bfff'
                            cornerRadius={{topLeft: 10, topRight: 10}}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </section>

            <section className="user-trip wrapper">
                {usersAndTrips.map(({ title, dataSource, field, headerText }, index) => (
                    <div className="flex flex-col gap-5" key={index}>
                        <h3 className='text-dark-100 p-20-semibold'>{title}</h3>
                        <GridComponent dataSource={dataSource} gridLines='None'>
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="name"
                                    headerText="Name"
                                    width="200"
                                    textAlign="Left"
                                />
                            </ColumnsDirective>
                        </GridComponent>
                    </div>
                ))}
            </section>

        </main>
    )
}
export default Dashboard
