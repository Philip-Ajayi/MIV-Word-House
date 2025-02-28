import React from 'react';
import BlogSection from "../Components/Home/Blog";
import EventsSection from "../Components/Home/Events";
import GreetingSection from "../Components/Home/Greetings";
import Hero from "../Components/Home/Hero";
import MinistriesSection from "../Components/Home/Ministries";
import SermonSection from "../Components/Home/SermonSection";
import WorshipTimes from "../Components/Home/Worship";


const Home = () => {
  return (
    <div className="">
      <Hero/>
      <GreetingSection />
      <WorshipTimes />
      <SermonSection />
      <EventsSection />
      <MinistriesSection />
      <BlogSection />
      
    </div>
  );
};

export default Home;
