import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Home() {
  return (
    <>
      <Helmet>
        <title>Rohit Upadhyay — Author, Storyteller, Academician</title>
        <meta name="description" content="Welcome to Rohit Upadhyay's official website. Explore books, blogs, and insights from an emerging author and storyteller." />
        <meta name="keywords" content="rohit upadhyay, author, writer, storyteller, books, blog" />
        <meta property="og:title" content="Home - Rohit Upadhyay" />
        <meta property="og:description" content="Welcome to Rohit Upadhyay's official website." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rohitupadhyay.me" />
        <link rel="canonical" href="https://www.rohitupadhyay.me" />
      </Helmet>

      <section className="relative py-12 md:py-20 px-6 bg-texture">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* ── Portrait ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:w-5/12 flex-shrink-0"
            >
              <div className="relative group">
                {/* Decorative frame behind image */}
                <div className="absolute -inset-3 border-2 border-gold/15 rounded-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                <div className="absolute -inset-3 border border-gold/10 rounded-2xl rotate-1 group-hover:rotate-0 transition-transform duration-700" />

                {/* Gold glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/12 via-gold/4 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60 group-hover:opacity-100" />

                <div className="relative img-zoom rounded-2xl shadow-2xl shadow-navy/15">
                  <img
                    src="/rohit.webp"
                    alt="Rohit Upadhyay"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full rounded-2xl object-cover"
                  />
                </div>

                
              </div>
            </motion.div>

            {/* ── Content ── */}
            <div className="lg:w-7/12 space-y-7">

              {/* Title */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-navy">
                  Welcome to
                  <span className="block gold-gradient-text mt-1">My World</span>
                </h1>
              </motion.div>

              {/* Ornamental divider */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <div className="ornament">
                  <span className="ornament-icon">✦</span>
                </div>
              </motion.div>

              {/* Author bio */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
                <p className="text-navy leading-[1.9] text-[1.05rem] md:text-lg">
                  <span className="text-gold font-serif font-semibold text-xl">Rohit Upadhyay</span> is an aspiring author, a storyteller, and a writer by heart whose
                  journey began in the corporate corridors of Health Management. Armed with an MBA,
                  he navigated the structured world of business — but his true calling lay beyond,
                  in the art of storytelling and creative expression.
                </p>
                <p className="text-slate leading-[1.9]">
                  Today, Rohit combines his life insights with his passion for writing, crafting
                  motivational blogs and stories that inspire personal growth and transformation.
                </p>
              </motion.div>

             

              {/* Quote */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                <div className="relative bg-ivory-warm rounded-xl p-6 border-l-4 border-gold">
                  <span className="quote-mark">"</span>
                  <p className="relative z-10 text-navy/80 italic font-serif text-lg md:text-xl leading-relaxed pl-4">
                    As a firm believer in the power of language, I use my words as conduits for
                    healing, understanding, and connection.
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-4 pt-3">
                <Link
                  to="/blog"
                  className="btn-shine px-8 py-3.5 bg-navy text-white font-semibold rounded-xl
                           hover:bg-navy-light hover:shadow-xl hover:shadow-navy/15
                           transition-all duration-300 text-sm tracking-wide"
                >
                  Read My Blog
                </Link>
                <Link
                  to="/books"
                  className="btn-shine px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold rounded-xl
                           hover:shadow-xl hover:shadow-gold/20
                           transition-all duration-300 text-sm tracking-wide"
                >
                  Explore Books
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3.5 text-navy hover:text-gold transition-all duration-300 text-sm font-medium
                           border-b-2 border-transparent hover:border-gold"
                >
                  About Me →
                </Link>
              </motion.div>

              {/* Warm footer note */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
                className="flex items-center gap-3 pt-4"
              >
                <div className="h-px w-10 bg-gold/25" />
                <p className="text-slate text-sm italic font-serif">
                  I'm extremely happy to have your presence in my world.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;