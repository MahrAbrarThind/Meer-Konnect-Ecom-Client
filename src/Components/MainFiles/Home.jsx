import React from 'react'
import SliderImg from './HomePages/SliderImg'
import ShowingSubCategories from './HomePages/ShowingSubCategories'
import ShowingFeaturedProducts from './HomePages/ShowingFeaturedProducts'
import ShowingClothesProducts from './HomePages/ShowingClothesProducts'
import ShowingBagsProducts from './HomePages/ShowingBagsProducts'

const Home = () => {
  return (
    <>
      <SliderImg/>
      <ShowingSubCategories/>
      <ShowingFeaturedProducts/>
      <ShowingClothesProducts/>
      <ShowingBagsProducts/>
    </>
  )
}

export default Home
