import React, {type FC} from 'react'
import {cn} from "../lib/utils";

interface StatsCardProps {
    headerTitle: string;
    total: number;
    currentMonthCount: number;
    lastMonthCount: number;
}

// I need a function to calculate the percentage changes and trend
const calculateTrendPercentage = (countOfThisMonth: number, countOfLastMonth: number) => {
    if (countOfLastMonth === 0) {
        return {
            percentage: 100,
            trend: "up"
        }
    }

    const changeInCount = countOfThisMonth - countOfLastMonth;
    const percentageChange = (changeInCount / Math.abs(countOfLastMonth)) * 100;

    const trend = percentageChange > 0 ? "increment" : percentageChange < 0 ? "decrement" : "no change";

    return {
        percentage: percentageChange.toFixed(2),
        trend
    }
}

const StatsCard: FC<StatsCard> = ({headerTitle, total, currentMonthCount, lastMonthCount}) => {
    const { trend, percentage } = calculateTrendPercentage(currentMonthCount, lastMonthCount);

    const decrement = trend === "decrement";

    return (
        <article className="stats-card">
            <h3 className="text-base font-medium">{headerTitle}</h3>

            <div className="content">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl font-semibold">{total}</h2>

                    <div className="flex items-center gap-2">
                        <figure className="flex gap-1 items-center">
                            <img className="size-6" src={`/assets/icons/${decrement ? "arrow-down-red.svg" : "arrow-up-green.svg"}`} alt="arrow"/>
                            <figcaption className={cn("text-sm font-medium", decrement ? "text-red-500" : "text-success-700")}>{percentage}%</figcaption>
                        </figure>
                        <p className="text-sm text-gray-100 font-medium truncate">vs last month</p>
                    </div>
                </div>

                {/*i need to use interactive charts instead of displaying chart images --- use syncfusion charts*/}
                <img
                    src={`/assets/icons/${decrement ? "decrement.svg" : "increment.svg"}`}
                    alt="charts"
                    className="xl:w-32 md:h-32 xl:h-full w-full h-full"
                />
            </div>
        </article>
    )
}
export default StatsCard
