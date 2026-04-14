import Hero from '../components/Hero'
import TechStrip from '../components/TechStrip'
import SocialProof from '../components/SocialProof'
import WhatWeShip from '../components/WhatWeShip'
import FeaturedProducts from '../components/FeaturedProducts'
import Story from '../components/Story'
import Guarantee from '../components/Guarantee'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <TechStrip />
      <WhatWeShip />
      <FeaturedProducts />
      <Story />
      <Guarantee />
      <FAQ />
      <Newsletter />
    </>
  )
}
