import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getUserGrowthPerDay } from '@/appwrite/dashboard'

const TravelPage = () => {
  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        const userGrowth = await getUserGrowthPerDay()
        console.log('User Growth:', userGrowth)
      } catch (error) {
        console.error('Error fetching user growth:', error)
      }
    }

    fetchUserGrowth()
  }, [])
  return (
    <div>
      <Button type='button' onClick={getUserGrowthPerDay}>Click</Button>
    </div>
  )
}

export default TravelPage