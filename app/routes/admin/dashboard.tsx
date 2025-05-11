import React from 'react'
import {Header, StatsCard, TripCard} from "universal-components";
import {dashboardData, allTrips} from "@/constants";
import type { Route } from './+types/dashboard';
import { getUser } from '@/appwrite/auth';


export const clientLoader = async () => getUser();


const Dashboard = ({loaderData}: Route.ComponentProps) => {
    const user = loaderData as unknown as User || null;

    // destructure data
    const {totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardData;

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
                        {allTrips.slice(0, 4).map(({id, name, imageUrls, tags, estimatedPrice, itinerary}) => (
                            <TripCard
                                key={id}
                                name={name}
                                imageUrl={imageUrls}
                                tags={tags}
                                location={itinerary[0].location}
                                id={id.toString()}
                                price={estimatedPrice}
                            />
                        ))}
                    </div>
                </section>
            </section>

        </main>
    )
}
export default Dashboard
