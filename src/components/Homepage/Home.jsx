import React from 'react';
import HeroSection from '../Home/HeroSection';
import Bestsellers from '../Home/Bestsellers';
import Banner from '../Home/Banner';
import TeaJourney from '../Home/TeaJourney';
import Testimonials from '../Home/Testimonials';
import StoryBanner from '../Home/StoryBanner';
import GallerySwiper from '../Home/GallerySwiper';
import FeaturesStrip from '../Home/FeaturesStrip';

const Home = () => {
  return (
    <main className="bg-white min-h-screen selection:bg-[#2d5a27] selection:text-white">
      {/* 1. World-Class Luxury Cinematic Video Hero */}
      <HeroSection />

      <FeaturesStrip/>

           {/* 3. Our Story — "Every Conversation Begins With Tea" */}
      <Banner />
       <div id="home-content">
        <Bestsellers />
      </div>

      {/* 4. From Our Gardens To Your Cup — 5-step journey */}
      <TeaJourney />

      {/* 5. Loved By Thousands Of Tea Lovers — Testimonials */}
      <Testimonials />

      {/* 6. Compact Craftsmanship & Heritage Banner */}
      <StoryBanner />

      {/* 7. Follow Our Journey — Instagram section */}
      <GallerySwiper />
    </main>
  );
};

export default Home;
