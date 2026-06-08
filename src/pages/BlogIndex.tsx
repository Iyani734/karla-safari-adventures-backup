import { useEffect, useRef, useState, type ReactNode } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { allPosts } from "../lib/blogData";
import { getBlogAnswerQuote } from "../lib/blogAnswerQuotes";
import { getBlogPostImage } from "../lib/blogImages";


// ─── FadeIn ──────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── ReadButton ───────────────────────────────────────────────────────────────
function ReadButton({ href, label = "Read Article" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 font-bold text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-orange-500/70 hover:from-orange-600 hover:to-red-700"
    >
      {label} <ArrowRight className="h-3 w-3" />
    </a>
  );
}

// ─── Featured post ────────────────────────────────────────────────────────────
const featured = {
  slug: "kenya-vs-tanzania-first-safari",
  title: "Kenya vs Tanzania for Your First Safari: Which Should You Choose?",
  excerpt:
    "Two legendary destinations. One unforgettable choice. Here's the honest, expert comparison no one else will give you.",
  category: "Planning Guide",
  readTime: 9,
  date: "Apr 15, 2025",
  image: "/migration.webp",
};

// ─── BlogIndex ────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const posts = allPosts.filter((p) => p.slug !== "kenya-vs-tanzania-first-safari");

  return (
    <div className="min-h-screen bg-slate-900">
      <section className="relative pb-12 pt-32 md:pt-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <FadeIn>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-orange-300">
                The Journal
              </span>
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-white md:text-7xl text-balance">
                Stories from the <span className="italic text-orange-300">field</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
                Planning guides, destination comparisons, and quiet
                observations from a decade of curating East African safaris.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <FadeIn>
            <a
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80 shadow-lift transition-all hover:border-orange-500/40 hover:shadow-glow lg:grid-cols-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
                <img
                  src={getBlogPostImage(featured.slug, featured.image)}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={1920}
                  height={1080}
                />
                <span className="absolute left-5 top-5 rounded-full border border-orange-400/60 bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-200 shadow-lg shadow-black/25 backdrop-blur">
                  Featured - {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <h2 className="font-serif text-3xl font-semibold leading-tight text-white transition-colors group-hover:text-orange-300 md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-gray-300">
                  {getBlogAnswerQuote(featured)}
                </p>
                <div className="mt-6 flex items-center gap-5 text-xs text-gray-400">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-400" /> {featured.readTime} min read
                  </span>
                </div>
                <div className="mt-8 flex justify-center md:justify-start">
                  <ReadButton href={`/blog/${featured.slug}`} label="Read the article" />
                </div>
              </div>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* All stories */}
 <section className="py-10 pb-24">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl">
            All stories
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.slug}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 transition-colors duration-300 hover:border-orange-500/40 hover:shadow-glow"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={getBlogPostImage(p.slug, p.image)}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={640}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-300 backdrop-blur border border-orange-400/50">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-white transition-colors group-hover:text-orange-300">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-300 line-clamp-3">
                    {getBlogAnswerQuote(p)}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{p.date}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-orange-400" /> {p.readTime} min read
                    </span>
                  </div>
                  <div className="mt-4 flex justify-start pt-1">
                    <ReadButton href={`/blog/${p.slug}`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
