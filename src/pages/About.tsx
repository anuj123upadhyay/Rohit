import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About - Rohit Upadhyay</title>
        <meta name="description" content="Learn about Rohit Upadhyay - storyteller, writer, and MBA graduate." />
        <meta name="keywords" content="about rohit upadhyay, author biography, writer, storyteller" />
        <meta property="og:title" content="About - Rohit Upadhyay" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rohitupadhyay.me/about" />
        <link rel="canonical" href="https://www.rohitupadhyay.me/about" />
      </Helmet>

      <section className="py-16 md:py-24 px-6 bg-texture">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-14">
            <p className="text-gold text-sm font-semibold tracking-[0.3em] uppercase mb-3">
              The Story Behind the Stories
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-5">
              About Rohit
            </h1>
            <div className="ornament max-w-xs mx-auto">
              <span className="ornament-icon">✦</span>
            </div>
          </motion.div>

          {/* Content Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <div className="premium-card p-8 md:p-12">
              <div className="relative z-10 space-y-6">
                <p className="text-lg leading-[1.9] text-navy">
                  <span className="float-left text-6xl font-serif text-gold font-bold mr-4 mt-1 leading-none drop-shadow-sm">H</span>
                  ello, my name is Rohit Upadhyay, and I'm a storyteller, aspiring
                  author, and writer at heart. From my earliest days of writing plays
                  and dramas in school that vividly portrayed various characters to
                  crafting tales that explored the essence of existence, writing has
                  always been very close to my heart and a way for me to interact with
                  the outside world.
                </p>

                <p className="text-lg leading-[1.9] text-navy">
                  The journey has not been without challenges. Despite having an MBA
                  in Health Management and having walked the corridors of structure
                  and strategy, my heart has always been in the unrestricted world of
                  creativity.
                </p>

                {/* Quote */}
                <div className="my-10 relative bg-ivory-warm rounded-xl p-6 md:p-8 border-l-4 border-gold">
                  <span className="quote-mark">"</span>
                  <p className="relative z-10 font-serif text-xl md:text-2xl italic text-navy/80 leading-relaxed pl-4">
                    As a writer, I want my words to sound like a friend's voice,
                    providing guidance, comfort, and sometimes a gentle reminder to
                    appreciate the beauty in your story.
                  </p>
                </div>

                <p className="text-lg leading-[1.9] text-navy">
                  Just like my writing, my relationship with each reader is unique. Whether you want to think,
                  explore, or find a different perspective, you'll get all dimensions
                  to read. And know this — I craft words by having <em className="font-serif text-gold font-semibold not-italic">you</em> in mind, always.
                </p>

                <p className="text-lg leading-[1.9] text-navy">
                  Greetings from my world, where stories are more than just words;
                  they serve as tools for understanding, healing, and personal
                  development.
                </p>

                {/* Closing ornament */}
                <div className="pt-6">
                  <div className="ornament max-w-xs mx-auto">
                    <span className="ornament-icon">✦</span>
                  </div>
                  <p className="text-center text-gold/70 font-serif italic text-sm mt-4">
                    I'm very happy you're here. :)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
