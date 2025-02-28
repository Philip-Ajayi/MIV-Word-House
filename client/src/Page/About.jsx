import React from 'react';
import AboutPage from "../Components/About/AboutMinistry";
import AnchorScripture from "../Components/About/Anchor";
import AboutHero from "../Components/About/Hero";
import Leadership from "../Components/About/Leadership";




const About = () => {
  return (
    <div className="space-y-16">
      <AboutHero />
      <AnchorScripture />
      <AboutPage />
      <Leadership />
    </div>
  );
};

export default About;
