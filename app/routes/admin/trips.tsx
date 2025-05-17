import React, { useState } from 'react'
import { Header, TripCard } from '@/universal-components'
import type { Route } from './+types/trips'
import { useSearchParams, type LoaderFunctionArgs } from 'react-router'
import { getAllTrips } from '@/appwrite/trips'
import { parseTripData } from 'lib/utils'
import { PagerComponent } from '@syncfusion/ej2-react-grids'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const result = await getAllTrips(limit, offset);
    if (!result) {
        throw new Error("Failed to fetch trips");
    }
    const { allTrips, total } = result;

    return {
        total,
        trips: allTrips.map(({ $id, imageUrls, tripDetail }) => ({
            id: $id,
            imageUrls: imageUrls ?? [],
            ...parseTripData(tripDetail)
        }))
    }
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const trips = loaderData.trips as Trip[] | [];

    // handle page pagination
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get("page") || "1");

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`;
    }

    return (
        <main className='all-trips wrapper'>
            <Header
                title='All Trips'
                description='View and edit AI-generated travel plans'
                ctaText='Create New Trip'
                ctaUrl='/trips/create'
            />

            <section>
                <h1 className='text-dark-100 p-24-semibold my-5'>Manage Created Trips</h1>

                <div className="trip-grid">
                    {trips.map(({ id, name, imageUrls, travelStyle, interests, itinerary, estimatedPrice }) => (
                        <TripCard
                            id={id}
                            name={name}
                            location={itinerary?.[0]?.location ?? ""}
                            imageUrl={imageUrls?.[0] ?? ""}
                            tags={[travelStyle, interests]}
                            key={id}
                            price={estimatedPrice}
                        />
                    ))}
                </div>
                <PagerComponent
                    className='my-5'
                    totalRecordsCount={loaderData.total}
                    pageSize={8}
                    currentPage={currentPage}
                    click={args => handlePageChange(args.currentPage)}
                />
            </section>
        </main>
    )
}

export default Trips