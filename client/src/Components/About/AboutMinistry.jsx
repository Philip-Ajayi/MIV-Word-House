import React from 'react';
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Container with complementary color (yellow) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-yellow-200 p-8 rounded">
        {/* About Our Ministry Section */}
        <motion.div
          className="p-6 bg-purple-500 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h3
            className="text-2xl lg:text-3xl font-semibold text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Men of Issachar Vision Inc
          </motion.h3>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The Men Of Issachar Vision Inc. founded in 1989 under the leadership of Rev. Samson Ajetomobi is a Christian organization committed to awakening and missions. Our focus on these two themes emanates from our understanding of the times we are in and what the church should be doing in such a crucial time just as the Issachar of old had understanding of the times and knew what Israel ought to do.
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            “and of the Children of Issachar which were men that had the understanding of the times, to know what Israel ought to do….” 1Chronicles 12:32 (KJV).
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Our awakening effort is anchored on reawakening of the church to her responsibilities especially through her leaders. Strategies presently being used to accomplish this include hosting and organization of Ministers Leadership Conferences, Alone With God prayer retreats, Family Life Conferences, Back To Bethel Retreats for women and Campus Leaders Repositioning meetings.
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Our understanding of missions encompasses reaching the unreached at all cost. Thus, in addition to sending missionaries to the fields, we are involved with mobilization of people and resources, promotion of opportunities and happenings, recruitment and training of missionaries, research and survey of the remaining unreached people groups, and organisation of mission conferences. We also carry out literacy missions through the establishment of schools in needy communities and medical missions.
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            We have missionary efforts ongoing in Benin Republic, Brazil, Cameroon, Cote D’ Ivoire, Egypt, Ghana, Liberia, Morocco, Nigeria, Senegal, South Africa, The Gambia, Tanzania, Togo, United Kingdom and United States of America.
          </motion.p>

          {/* "See More" Button */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="https://menofissacharvision.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              See More
            </a>
          </motion.div>
        </motion.div>

        {/* About Our Church Section */}
        <motion.div
          className="p-6 bg-purple-500 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h3
            className="text-2xl lg:text-3xl font-semibold text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Word House
          </motion.h3>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            WORD HOUSE is a Young People's Church of The Men of Issachar Vision Inc.
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            "...I have written to you, young men, because you are strong and vigorous, and the word of God remains [always] in you, and you have been victorious over the evil one [by accepting Jesus as Savior]" - 1John 2:14 (AMP)
          </motion.p>
          <motion.p
            className="mt-4 text-lg lg:text-xl text-white text-justify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to WORD HOUSE, where young people are strong, vigorous and victorious!
          </motion.p>
          <div className="mt-8 flex justify-center">
            <motion.img
              src="https://i.ibb.co/B6sT0v1/mivwordhousedescription.png"
              alt="Church Infographic"
              className="w-full max-w-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPage;
