import React from 'react'
import {Header, StatsCard, TripCard} from "../../../components";

const Dashboard = () => {
    const user = {name: "Tamale Frank"}

    // statistic data
    const dashboardData = {
        totalUsers: 12450,
        usersJoined: {
            lastMonth: 218, currentMonth: 200
        },
        totalTrips: 3210,
        tripsCreated: {currentMonth: 1200, lastMonth: 1000},
        userRole: {total: 62, currentMonth: 50, lastMonth: 20}
    }

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

            <TripCard/>
        </main>
    )
}
export default Dashboard
