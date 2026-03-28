import { useState, FormEvent } from "react";
import {
  FaLinkedin, FaTwitter, FaInstagram, FaMapMarkerAlt, FaFacebook, FaEnvelope,
} from "react-icons/fa";
import { databases } from "../appwrite/appwriteConfig";
import { ID } from "appwrite";
import conf from "../config/conf";
import { useNewsletter } from "../hooks/useNewsletter";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

function Contact() {
  const [formData, setFormData] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const { isSubscribing, subscribe } = useNewsletter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name || !formData.email || !formData.subject || !formData.message) throw new Error("All fields are required");
      if (!validateEmail(formData.email)) throw new Error("Please enter a valid email address");
      await databases.createDocument(conf.appwriteDatabaseId, conf.appwriteContactCollection, ID.unique(), { ...formData, status: "new" });
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);
    try {
      if (!validateEmail(newsletterEmail)) { toast.error("Please enter a valid email address"); return; }
      const success = await subscribe(newsletterEmail);
      if (success) { setNewsletterSuccess(true); setNewsletterEmail(""); toast.success("Successfully subscribed!"); }
    } catch (err) {
      setNewsletterError(err instanceof Error ? err.message : "Failed to subscribe");
      toast.error("Failed to subscribe");
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Rohit Upadhyay — Reach Indian Author & Storyteller | Get in Touch</title>
        <meta name="title" content="Contact Rohit Upadhyay — Reach Indian Author & Storyteller | Get in Touch" />
        <meta name="description" content="Get in touch with Rohit Upadhyay — Indian author, storyteller, and poet based in New Delhi. Send a message, collaborate on projects, or subscribe to his newsletter for exclusive stories and updates." />
        <meta name="keywords" content="contact Rohit Upadhyay, Rohit Upadhyay email, reach Rohit Upadhyay, Indian author contact, author New Delhi contact, collaborate with Rohit Upadhyay, Rohit Upadhyay newsletter, message Rohit Upadhyay" />
        <meta name="author" content="Rohit Upadhyay" />
        <link rel="canonical" href="https://rohit.upadhyayji.me/contact" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rohit.upadhyayji.me/contact" />
        <meta property="og:title" content="Contact Rohit Upadhyay — Indian Author & Storyteller" />
        <meta property="og:description" content="Reach out to Indian author Rohit Upadhyay. Subscribe to his newsletter for exclusive stories and updates." />
        <meta property="og:image" content="https://rohit.upadhyayji.me/rohit.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rohit Upadhyay - Author" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@rohit5upadhyay" />
        <meta name="twitter:creator" content="@rohit5upadhyay" />
        <meta name="twitter:title" content="Contact Rohit Upadhyay — Indian Author" />
        <meta name="twitter:description" content="Reach out to Indian author Rohit Upadhyay or subscribe to his newsletter." />
        
        {/* Structured Data — ContactPage + BreadcrumbList */}
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": "https://rohit.upadhyayji.me/contact#contactpage",
              "name": "Contact Rohit Upadhyay",
              "url": "https://rohit.upadhyayji.me/contact",
              "description": "Contact page for Indian author Rohit Upadhyay. Send a message, collaborate, or subscribe to newsletter.",
              "isPartOf": { "@id": "https://rohit.upadhyayji.me/#website" },
              "about": { "@id": "https://rohit.upadhyayji.me/#author" },
              "mainEntity": {
                "@type": "Person",
                "@id": "https://rohit.upadhyayji.me/#author",
                "name": "Rohit Upadhyay",
                "email": "upadhyayr8171@gmail.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Dwarka Sector 14, Bharat Vihar, Som Bazar Road",
                  "addressLocality": "New Delhi",
                  "addressRegion": "Delhi",
                  "postalCode": "110078",
                  "addressCountry": "IN"
                }
              },
              "inLanguage": "en-IN"
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://rohit.upadhyayji.me/contact#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://rohit.upadhyayji.me/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Contact",
                  "item": "https://rohit.upadhyayji.me/contact"
                }
              ]
            }
          ]
        }`}</script>
      </Helmet>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
            <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-2">Let's Connect</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">Contact</h1>
            <div className="section-divider max-w-xs mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Contact Form */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <div className="glass-card rounded-2xl p-8 h-full">
                <h2 className="font-serif text-2xl font-semibold text-navy mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { label: "Name", type: "text", key: "name" as const },
                    { label: "Email", type: "email", key: "email" as const },
                    { label: "Subject", type: "text", key: "subject" as const },
                  ].map(({ label, type, key }) => (
                    <div key={key}>
                      <label className="block text-navy text-sm mb-2 font-medium">{label}</label>
                      <input
                        type={type} required
                        className="w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
                                 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all duration-200
                                 placeholder-slate/40"
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-navy text-sm mb-2 font-medium">Message</label>
                    <textarea
                      required rows={5}
                      className="w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
                               focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all duration-200
                               placeholder-slate/40 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${loading ? "bg-ivory-dark text-slate cursor-not-allowed" : "bg-navy text-white hover:bg-navy-light hover:shadow-lg"
                      }`}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
                {success && <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm">Message sent successfully!</div>}
                {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">{error}</div>}
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-6">
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="font-serif text-2xl font-semibold text-navy mb-5">Connect</h2>
                  <div className="flex gap-3">
                    {[
                      { icon: FaTwitter, href: "https://twitter.com/rohit5upadhyay", label: "Twitter" },
                      { icon: FaLinkedin, href: "https://linkedin.com/in/rohit5upadhyay", label: "LinkedIn" },
                      { icon: FaInstagram, href: "https://instagram.com/authorhandle", label: "Instagram" },
                      { icon: FaFacebook, href: "https://www.facebook.com/yourprofile", label: "Facebook" },
                      { icon: FaEnvelope, href: "mailto:upadhyayr8171@gmail.com", label: "Email" },
                    ].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label} href={href}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                        className="w-11 h-11 rounded-xl bg-ivory-warm border border-navy/8 flex items-center justify-center
                                 text-slate hover:text-gold hover:border-gold/30 hover:bg-gold-50 transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="font-serif text-2xl font-semibold text-navy mb-4">
                    <FaMapMarkerAlt className="inline-block mr-2 text-lg text-gold" />Location
                  </h2>
                  <p className="text-slate leading-relaxed text-sm">
                    Dwarka Sector 14, Bharat Vihar<br />Som Bazar Road<br />New Delhi, Delhi - 110078, India
                  </p>
                </div>
              </motion.div>

              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="font-serif text-2xl font-semibold text-navy mb-4">Subscribe to Newsletter</h2>
                  <p className="text-slate text-sm mb-4">Get exclusive stories and updates delivered to your inbox.</p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="email" required placeholder="Your email address"
                      className="w-full px-4 py-3 bg-ivory-warm text-navy border border-navy/10 rounded-xl
                               focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all duration-200
                               placeholder-slate/40 text-sm"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={isSubscribing}
                    />
                    <button
                      type="submit" disabled={isSubscribing}
                      className={`w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-white font-semibold rounded-xl text-sm
                                hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 ${isSubscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubscribing ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>
                  {newsletterSuccess && <div className="mt-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm">Subscribed successfully!</div>}
                  {newsletterError && <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">{newsletterError}</div>}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
