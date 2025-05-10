import React from 'react'
import { Header } from "universal-components";
import {Button} from "@/components/ui/button";

const AllTrips = () => {
    return (
        <main className="wrapper">
            <Header title="Trips Page" description="Check out all our current users in real time" />
            <Button>Click ME</Button>
        </main>
    )
}
export default AllTrips
