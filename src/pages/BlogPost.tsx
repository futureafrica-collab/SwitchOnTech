import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, User, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const allPosts = [
  {
    slug: "5-signs-your-laptop-needs-professional-repair",
    category: "Repair Tips",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
    title: "5 Signs Your Laptop Needs Professional Repair",
    excerpt: "Ignoring these warning signs could cost you more in the long run. Here is what to watch out for.",
    author: "Switchon Tech",
    date: "March 20, 2026",
    readTime: "5 min read",
    body: [
      "Your laptop is one of the most important tools you use daily — whether for work, school, or entertainment. But like any piece of technology, it won't last forever without proper care. Many people wait until their laptop completely stops working before seeking help, but by then the damage could be far more expensive to fix. Recognizing the early warning signs can save you both time and money.",
      "One of the first signs that something is wrong is unusual heat. If your laptop is running hot even when you're not doing anything intensive, it could indicate a failing fan, clogged vents, or thermal paste that needs replacing. Overheating can damage your motherboard, battery, and other internal components if left unchecked. Another red flag is a battery that drains unusually fast or won't hold a charge at all — this often means the battery cells are degrading and need replacement.",
      "Slow performance is another common symptom that people tend to ignore. If your laptop takes minutes to boot up, applications freeze regularly, or you see the dreaded spinning wheel constantly, it could be a sign of a failing hard drive, insufficient RAM, or even malware infections. At Switchon Tech, we run comprehensive diagnostics to identify the root cause before recommending any repairs, ensuring you only pay for what's actually needed.",
      "Strange noises like clicking, grinding, or buzzing sounds should never be ignored. These often indicate a failing hard drive or a loose internal component. Similarly, display issues such as flickering screens, dead pixels, or lines across the monitor can point to a damaged display cable or a failing GPU. If you notice any of these signs, bring your laptop to our centre in Gbagada, Lagos, and our certified technicians will get it running like new again."
    ],
  },
  {
    slug: "how-to-choose-the-right-cctv-system-for-your-business",
    category: "Security",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    title: "How to Choose the Right CCTV System for Your Business",
    excerpt: "Not all CCTV systems are equal. We break down what to look for before making a purchase.",
    author: "Switchon Tech",
    date: "March 15, 2026",
    readTime: "7 min read",
    body: [
      "Security is a top priority for every business owner in Nigeria, and installing a CCTV system is one of the most effective ways to protect your property, staff, and customers. However, with so many options available in the market — from budget cameras to enterprise-grade systems — choosing the right setup can be overwhelming. This guide will help you make an informed decision.",
      "The first thing to consider is the type of camera you need. Dome cameras are ideal for indoor use and offer a discreet, tamper-resistant design. Bullet cameras are better suited for outdoor monitoring with their longer range and weatherproof housing. PTZ (Pan-Tilt-Zoom) cameras are perfect for large areas like warehouses or car parks where you need to monitor a wide field of view with the ability to zoom into specific areas remotely.",
      "Resolution matters more than most people think. A 1080p camera might seem sufficient, but if you need to identify faces or read vehicle number plates, you'll want at least 2K or 4K resolution. Storage is equally important — consider whether you want local storage via an NVR (Network Video Recorder) or cloud-based storage for remote access. Many modern systems offer hybrid solutions that give you the best of both worlds.",
      "At Switchon Tech, we don't just sell cameras — we provide complete security solutions including site assessment, professional installation, network configuration, and ongoing maintenance. Our team will evaluate your premises, identify blind spots, and recommend a system tailored to your specific needs and budget. Visit us in Gbagada or call us for a free consultation."
    ],
  },
  {
    slug: "setting-up-a-reliable-office-network-in-nigeria",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    title: "Setting Up a Reliable Office Network in Nigeria",
    excerpt: "A step-by-step guide to building a fast, secure and scalable office network from scratch.",
    author: "Switchon Tech",
    date: "March 10, 2026",
    readTime: "6 min read",
    body: [
      "A reliable office network is the backbone of any modern business. Whether you're running a small startup or managing a growing enterprise, your network infrastructure determines how efficiently your team communicates, shares files, accesses cloud services, and serves customers. In Nigeria, where internet connectivity can be unpredictable, having a well-designed network is even more critical.",
      "The foundation of any good office network starts with structured cabling. Using Category 6 (Cat6) or Cat6a ethernet cables ensures you have the bandwidth to support today's demands and tomorrow's growth. Proper cable management — with patch panels, cable trays, and clearly labeled connections — makes troubleshooting faster and prevents the tangled mess that plagues many Nigerian offices.",
      "Your choice of networking equipment matters enormously. Invest in enterprise-grade switches and routers rather than consumer models — they offer better throughput, more advanced security features, and greater reliability. For wireless coverage, consider deploying multiple access points with a centralized controller rather than relying on a single router. This ensures consistent Wi-Fi coverage throughout your office without dead zones.",
      "Network security should be built in from day one, not added as an afterthought. Implement VLANs to segment your network, use WPA3 encryption for wireless connections, deploy a firewall with intrusion detection, and establish a guest network separate from your corporate network. At Switchon Tech, we design, install, and maintain complete office network solutions. Contact us to schedule a free site survey."
    ],
  },
  {
    slug: "best-budget-laptops-for-students-in-2026",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    title: "Best Budget Laptops for Students in 2026",
    excerpt: "Our top picks for affordable laptops that deliver great performance for school and everyday tasks.",
    author: "Switchon Tech",
    date: "March 5, 2026",
    readTime: "8 min read",
    body: [
      "Finding the right laptop as a student in Nigeria can be challenging, especially when you're working with a tight budget. You need something that can handle assignments, research, presentations, and maybe some light entertainment — all without breaking the bank. We've put together this guide based on real-world testing and feedback from students who visit our centre.",
      "When shopping for a student laptop, prioritize these key specs: at least 8GB of RAM for smooth multitasking, an SSD (Solid State Drive) for fast boot times and application loading, and a battery that lasts at least 6-8 hours. The processor matters too — look for at least an Intel Core i5 12th gen or AMD Ryzen 5 5000 series for a good balance of performance and power efficiency.",
      "Display quality is often overlooked but incredibly important for students who spend hours reading and writing. A Full HD (1920x1080) IPS display with good colour accuracy will reduce eye strain and make your work more enjoyable. Avoid laptops with TN panels — they have poor viewing angles and washed-out colours that make extended use uncomfortable.",
      "At Switchon Tech, we stock a carefully curated selection of laptops for students at competitive prices. Every laptop we sell comes with a warranty, free initial setup, and expert advice on which model best suits your course of study. Whether you're studying engineering, medicine, business, or the arts, we'll help you find the perfect match. Visit our shop in Gbagada, Lagos."
    ],
  },
  {
    slug: "why-every-nigerian-youth-should-learn-ict-skills",
    category: "Training",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    title: "Why Every Nigerian Youth Should Learn ICT Skills",
    excerpt: "The digital economy is booming. Here is why ICT training is the smartest investment you can make.",
    author: "Switchon Tech",
    date: "February 28, 2026",
    readTime: "4 min read",
    body: [
      "Nigeria's digital economy is growing at an unprecedented rate. From fintech startups to e-commerce platforms, technology is reshaping every sector of the economy. For young Nigerians, this represents an incredible opportunity — but only if you have the right skills. ICT training isn't just about learning to use a computer; it's about building the foundation for a successful career in the 21st century.",
      "The demand for ICT professionals in Nigeria far outstrips supply. Companies across all industries are looking for people who can manage networks, develop software, analyse data, handle cybersecurity, and maintain IT infrastructure. Even traditional roles in banking, healthcare, and education now require strong digital literacy. By investing in ICT training, you're positioning yourself for higher-paying jobs and greater career mobility.",
      "Beyond employment, ICT skills empower you to become an entrepreneur. With the right technical knowledge, you can build websites, develop mobile apps, offer freelance services to clients worldwide, or start your own tech support business. Many of our graduates at Switchon Tech have gone on to launch successful ventures or secure well-paying positions at leading companies.",
      "At Switchon Tech, we offer practical, hands-on ICT training programmes covering computer hardware repair, networking, CCTV installation, web development, and more. Our courses are designed for beginners and intermediate learners, with flexible scheduling to accommodate working professionals and students. Enrol today and take the first step toward a brighter future."
    ],
  },
  {
    slug: "switchon-tech-expands-services-to-more-cities",
    category: "General",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    title: "Switchon Tech Expands Services to More Cities",
    excerpt: "We are bringing professional ICT solutions to more communities across Nigeria. See what is new.",
    author: "Switchon Tech",
    date: "February 20, 2026",
    readTime: "3 min read",
    body: [
      "Since we opened our doors in Gbagada, Lagos, Switchon Tech has been committed to providing affordable, professional ICT services to individuals and businesses across Nigeria. Today, we're excited to announce that we're expanding our reach to serve even more communities. This expansion reflects the growing demand for reliable technology solutions in Nigeria's rapidly digitising economy.",
      "Our expansion plans include partnerships with local technicians and businesses in key cities across the South-West and South-South regions. Through these partnerships, we'll be able to offer the same quality of service that our Lagos customers have come to expect — from laptop repairs and networking setups to CCTV installations and ICT training — without the need for customers to travel to our main centre.",
      "We're also investing heavily in our online presence to serve customers nationwide. Our new e-commerce platform will allow anyone in Nigeria to browse and purchase laptops, accessories, and networking equipment with delivery to their doorstep. For services that require on-site visits, our network of certified technicians will be dispatched to your location.",
      "This growth wouldn't be possible without the trust and loyalty of our customers. We remain committed to our core values: honest pricing, quality workmanship, and exceptional customer service. Whether you're in Lagos, Ibadan, Port Harcourt, or Abuja, Switchon Tech is here to help you stay connected. Follow us on social media for updates on our expansion timeline."
    ],
  },
];

const BlogPost = () => {
  const { slug } = useParams();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-accent font-semibold hover:underline">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      {/* Featured Image Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">
              {post.category}
            </span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <CalendarDays size={14} /> {post.date}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mb-8">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
        </div>

        <div className="h-px bg-border mb-8" />

        <div className="prose prose-lg max-w-none space-y-6">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Share2 size={16} /> Share this article
            </span>
            <a
              href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#25D366" }}
              aria-label="Share on WhatsApp"
            >
              W
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#1877F2" }}
              aria-label="Share on Facebook"
            >
              F
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#1DA1F2" }}
              aria-label="Share on Twitter"
            >
              T
            </a>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rp, i) => (
              <motion.div
                key={rp.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${rp.slug}`}
                  className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="overflow-hidden h-44">
                    <img src={rp.image} alt={rp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">
                      {rp.category}
                    </span>
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors">{rp.title}</h3>
                    <p className="text-xs text-muted-foreground">{rp.date} · {rp.readTime}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
