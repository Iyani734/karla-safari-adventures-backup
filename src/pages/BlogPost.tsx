import { useState, useEffect, useRef, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Quote,
  Lightbulb,
  MapPin,
  Camera,
  Compass,
  Eye,
  Link2,
  Check,
  Facebook,
  Twitter,
  MessageCircle,
  Instagram,
  ChevronDown,
  Share2,
} from "lucide-react";
import { allPosts, type BlogPost, type BlogSection } from "../lib/blogData";
import { getBlogAnswerQuote } from "../lib/blogAnswerQuotes";
import { getBlogPostImage, getBlogSectionImage } from "../lib/blogImages";


// ─── ReadingProgress ──────────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
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
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
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

// ─── ReadButton — exact style from reference ─────────────────────────────────
function buildPath(to: string, params?: Record<string, string>) {
  if (!params) return to;

  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`$${key}`, encodeURIComponent(value)),
    to,
  );
}

function ReadButton({
  href,
  to,
  params,
}: {
  href?: string;
  to?: string;
  params?: Record<string, string>;
}) {
  const target = href || (to ? buildPath(to, params) : "#");

  return (
    <a
      href={target}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:from-orange-600 hover:to-red-700"
    >
      Read article <ArrowRight className="h-3 w-3" />
    </a>
  );
}

// ─── TOC fallback ─────────────────────────────────────────────────────────────
const FALLBACK_TOC = [
  { id: "why-it-matters", label: "Why this question matters" },
  { id: "the-setting", label: "The setting" },
  { id: "what-well-cover", label: "What we'll cover" },
  { id: "operators-wont-tell", label: "What operators won't tell you" },
  { id: "bottom-line", label: "The honest bottom line" },
];

// ─── ArticleSidebar ───────────────────────────────────────────────────────────
const TANZANIA_COST_GUIDE_SLUG = "tanzania-safari-cost-guide";

function getBlogDisplayTitle(post: Pick<BlogPost, "slug" | "title">) {
  if (post.slug === TANZANIA_COST_GUIDE_SLUG) {
    return "How Much Does a Tanzania Safari Actually Cost? An Honest Budget Planning Guide";
  }

  return post.title;
}

const BLOG_SHARE_WIDTH = 1600;
const BLOG_SHARE_HEIGHT = 900;
const authorImage = "/ian-nganga-removebg.png";

function resolveAssetUrl(src: string) {
  return new URL(src, window.location.origin).href;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = src;
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
      continue;
    }

    if (line) lines.push(line);
    line = word;

    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);

  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[,.!?;:]?$/, "")}...`;
  }

  lines.forEach((lineText, index) => {
    ctx.fillText(lineText, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

async function createBlogShareImageFile({
  post,
  imageUrl,
  articleUrl,
}: {
  post: BlogPost;
  imageUrl: string;
  articleUrl: string;
}) {
  const response = await fetch(resolveAssetUrl(imageUrl), { mode: "cors" });
  if (!response.ok) throw new Error("Image could not be downloaded.");

  const sourceBlob = await response.blob();
  const objectUrl = URL.createObjectURL(sourceBlob);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = BLOG_SHARE_WIDTH;
    canvas.height = BLOG_SHARE_HEIGHT;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported.");

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, BLOG_SHARE_WIDTH, BLOG_SHARE_HEIGHT);

    const imageRatio = image.width / image.height;
    const canvasRatio = BLOG_SHARE_WIDTH / BLOG_SHARE_HEIGHT;
    let drawWidth = BLOG_SHARE_WIDTH;
    let drawHeight = BLOG_SHARE_HEIGHT;
    let drawX = 0;
    let drawY = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = BLOG_SHARE_HEIGHT;
      drawWidth = BLOG_SHARE_HEIGHT * imageRatio;
      drawX = (BLOG_SHARE_WIDTH - drawWidth) / 2;
    } else {
      drawWidth = BLOG_SHARE_WIDTH;
      drawHeight = BLOG_SHARE_WIDTH / imageRatio;
      drawY = (BLOG_SHARE_HEIGHT - drawHeight) / 2;
    }

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    const overlay = ctx.createLinearGradient(0, 0, BLOG_SHARE_WIDTH, 0);
    overlay.addColorStop(0, "rgba(15, 23, 42, 0.95)");
    overlay.addColorStop(0.46, "rgba(15, 23, 42, 0.76)");
    overlay.addColorStop(0.72, "rgba(15, 23, 42, 0.28)");
    overlay.addColorStop(1, "rgba(15, 23, 42, 0.08)");
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, BLOG_SHARE_WIDTH, BLOG_SHARE_HEIGHT);

    const bottomOverlay = ctx.createLinearGradient(0, BLOG_SHARE_HEIGHT * 0.4, 0, BLOG_SHARE_HEIGHT);
    bottomOverlay.addColorStop(0, "rgba(15, 23, 42, 0)");
    bottomOverlay.addColorStop(1, "rgba(15, 23, 42, 0.78)");
    ctx.fillStyle = bottomOverlay;
    ctx.fillRect(0, 0, BLOG_SHARE_WIDTH, BLOG_SHARE_HEIGHT);

    ctx.fillStyle = "rgba(249, 115, 22, 0.96)";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText("KARLA SAFARI ADVENTURES", 88, 104);

    const displayTitle = getBlogDisplayTitle(post);

    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.font = "700 66px Georgia, serif";
    const afterTitleY = wrapCanvasText(ctx, displayTitle, 88, 418, 900, 78, 4);

    ctx.fillStyle = "rgba(255, 237, 213, 0.94)";
    ctx.font = "500 30px Arial, sans-serif";
    wrapCanvasText(ctx, `${post.category} | ${post.readTime} min read`, 88, afterTitleY + 36, 900, 40, 2);

    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    ctx.font = "500 26px Arial, sans-serif";
    wrapCanvasText(ctx, articleUrl.replace(/^https?:\/\//, ""), 88, 820, 900, 34, 2);

    const shareBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Blog share image could not be created."));
      }, "image/png", 0.92);
    });

    return new File([shareBlob], `${post.slug}-blog-share.png`, { type: "image/png" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function downloadFile(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function ArticleSidebar({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const url = `https://karlasafariadventures.com/blog/${post.slug}`;
  const displayTitle = getBlogDisplayTitle(post);
  const shareText = `${displayTitle} - ${url}`;
  const postImage = getBlogPostImage(post.slug, post.image);
  const enc = encodeURIComponent;
  const shareUrls = {
    instagram: "https://www.instagram.com/",
    whatsapp: `https://wa.me/?text=${enc(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    x: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(displayTitle)}`,
  };

  const toc = post.body
    ? post.body.sections.map((s) => ({ id: s.id, label: s.heading }))
    : FALLBACK_TOC;

  const firstToc = toc[0];
  const restToc = toc.slice(1);

  const showCopiedState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showCopiedState();
  };

  const copyLink = async () => {
    try {
      await copyShareText(url);
    } catch { /* ignore */ }
  };

  const sharePost = async (fallbackUrl: string) => {
    const shareData = {
      title: displayTitle,
      text: shareText,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyShareText(shareText);
    } catch { /* ignore */ }

    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
  };

  const shareBlogImage = async (fallbackUrl: string) => {
    setShareStatus("Preparing blog share...");

    try {
      const file = await createBlogShareImageFile({ post, imageUrl: postImage, articleUrl: url });
      const shareData = {
        title: displayTitle,
        text: shareText,
        url,
        files: [file],
      };

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share(shareData);
          setShareStatus("Blog ready to share.");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            setShareStatus("");
            return;
          }
        }
      }

      downloadFile(file);
      try {
        await copyShareText(shareText);
      } catch { /* ignore */ }
      setShareStatus("Blog card downloaded. Link copied.");
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    } catch {
      setShareStatus("Blog card unavailable. Sharing link instead.");
      await sharePost(fallbackUrl);
    }
  };

  return (
    <aside className="order-last w-full min-w-0 lg:order-none lg:sticky lg:top-36 lg:self-start lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin]">

      {/* Meta + share card */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-orange-400" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-400" />
            {post.readTime} min read
          </span>
        </div>

        {/* Copy link */}
        <button
          type="button"
          onClick={copyLink}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
            copied
              ? "border-orange-500/40 bg-orange-500/15 text-orange-300"
              : "border-slate-700 bg-slate-900/40 text-gray-400 hover:border-orange-500/40 hover:text-orange-300"
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Link copied!" : "Copy link"}
        </button>

        <button
          type="button"
          onClick={() => shareBlogImage(shareUrls.instagram)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/15 px-4 py-2.5 text-sm font-semibold text-orange-200 transition-all hover:border-orange-400/60 hover:bg-orange-500/20"
        >
          <Share2 className="h-4 w-4" />
          Share blog
        </button>

        {/* Social icons */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" onClick={() => shareBlogImage(shareUrls.instagram)} aria-label="Share blog to Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-orange-400 transition hover:border-orange-500/50 hover:text-orange-300">
            <Instagram className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => shareBlogImage(shareUrls.whatsapp)} aria-label="Share blog to WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-orange-400 transition hover:border-orange-500/50 hover:text-orange-300">
            <MessageCircle className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => shareBlogImage(shareUrls.facebook)} aria-label="Share blog to Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-orange-400 transition hover:border-orange-500/50 hover:text-orange-300">
            <Facebook className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => shareBlogImage(shareUrls.x)} aria-label="Share blog to X"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-orange-400 transition hover:border-orange-500/50 hover:text-orange-300">
            <Twitter className="h-4 w-4" />
          </button>
        </div>
        {shareStatus && (
          <p className="mt-3 text-center text-xs text-orange-200" aria-live="polite">
            {shareStatus}
          </p>
        )}
      </div>

      {/* In this article — dropdown style: first item always visible, rest collapse */}
      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-300">
          In this article
        </span>

        {/* First TOC item — always visible */}
        <ul className="mt-5 space-y-3.5 text-sm">
          <li>
            <a href={`#${firstToc.id}`} className="block leading-snug text-gray-300 transition-colors hover:text-orange-200">
              {firstToc.label}
            </a>
          </li>
        </ul>

        {/* Collapsible rest */}
        {restToc.length > 0 && (
          <>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: tocOpen ? "999px" : "0px" }}
            >
              <ul className="mt-3.5 space-y-3.5 text-sm">
                {restToc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="block leading-snug text-gray-300 transition-colors hover:text-orange-200">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setTocOpen((o) => !o)}
             className="mt-4 flex w-full items-center justify-between text-xs font-semibold text-orange-300 transition-colors hover:text-orange-200"
>
            
              <span>{tocOpen ? "Show less" : `+${restToc.length} more topics`}</span>
  <ChevronDown
    className="h-3.5 w-3.5 transition-transform duration-300"
    style={{ transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
  />
            </button>
          </>
        )}
      </div>

      {/* CTAs */}
      <div className="mt-4 space-y-2">
        <a href="/contact"
          className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-700 hover:shadow-xl">
          Plan This Trip
        </a>
        <a href="/safaris"
          className="flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-orange-300 transition-all hover:border-orange-500/40 hover:text-orange-200">
          Browse Safaris
        </a>
        <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-300 shadow-lg transition-all hover:border-orange-500/50 hover:bg-orange-500/15 hover:text-orange-200">
          <MessageCircle className="h-4 w-4" /> WhatsApp Us
        </a>
      </div>

      {/* Author mini */}
      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
        <div className="flex items-center gap-3">
          <div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-1 shadow-[0_0_22px_rgba(249,115,22,0.28)]"
            style={{
              background:
                "radial-gradient(circle at 34% 28%, rgba(251, 146, 60, 0.78), rgba(234, 88, 12, 0.32) 48%, rgba(15, 23, 42, 0.86) 100%)",
            }}
          >
            <img
              src={authorImage}
              alt="Ian Ng'ang'a"
              loading="lazy"
              className="relative h-full w-full rounded-full border border-orange-500/40 object-cover object-[50%_24%]"
            />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">Written by</div>
            <div className="font-serif text-sm font-bold text-white">Ian Ng'ang'a</div>
            <div className="text-xs text-gray-400">Lead Safari Curator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── RichBody — every section gets an image ───────────────────────────────────
function RichBody({ sections, postImage, postSlug }: { sections: BlogSection[]; postImage: string; postSlug: string }) {
  return (
    <>
      {sections.map((s, idx) => (
        <FadeIn key={s.id}>
          {/* Section heading — warm white, NOT orange, matches reference body text style */}
          <h2
            id={s.id}
         className="mt-12 scroll-mt-28 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            {s.heading}
          </h2>

          {/* Section image — use provided or fall back to post image */}
<figure className="my-6 overflow-hidden rounded-2xl">
              <img
                src={getBlogSectionImage(postSlug, s.id, s.image || postImage)}
                alt={s.imageAlt ?? s.heading}
                loading="lazy"
                className="h-80 w-full object-cover md:h-96"
              />
            </figure>

          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-lg  leading-relaxed text-gray-300">{p}</p>
          ))}

          {s.bullets && (
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {s.bullets.map((b, i) => (
                <li key={i} className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">{b.title}</div>
                  <div className="mt-2 text-sm text-gray-300">{b.body}</div>
                </li>
              ))}
            </ul>
          )}

          {s.callout?.kind === "tip" && (
            <div className="my-8 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-600/5 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">Pro tip from the field</span>
              </div>
              <p className="mt-4 font-serif text-lg leading-relaxed text-gray-300">{s.callout.text}</p>
            </div>
          )}

          {s.callout?.kind === "quote" && (
            <figure className="my-8 rounded-2xl border-l-4 border-orange-500 bg-slate-800/80 p-6 md:p-8">
              <Quote className="h-7 w-7 text-orange-300" />
              <blockquote className="mt-3 font-serif text-lg italic leading-snug text-gray-300 md:text-2xl">
                "{s.callout.text}"
              </blockquote>
              {s.callout.attribution && (
                <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-400">
                  — {s.callout.attribution}
                </figcaption>
              )}
            </figure>
          )}
        </FadeIn>
      ))}
    </>
  );
}

// ─── BlogPostPage ─────────────────────────────────────────────────────────────
function TanzaniaCostGuideHero({
  post,
  postImage,
  displayTitle,
}: {
  post: BlogPost;
  postImage: string;
  displayTitle: string;
}) {
  const costBands = [
    { label: "Short budget", value: "3-4 days: $850-$2.6k", detail: "Basic road safari; $1.5k is possible when timing and routing are tight" },
    { label: "Core circuit", value: "5-7 days: $1.65k-$4.2k", detail: "Budget northern circuit with Serengeti costs rising by park days" },
    { label: "Best balance", value: "7-8 days: $4.2k-$10k", detail: "Comfortable mid-range, stronger camps, flights or prime Serengeti add cost" },
  ];

  return (
    <section className="relative isolate min-h-[82vh] w-full overflow-hidden">
      <img
        src={postImage}
        alt={displayTitle}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/30 via-slate-950/55 to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_26%,rgba(249,115,22,0.24),transparent_32%)]" />

      <div className="container mx-auto flex min-h-[82vh] flex-col justify-between px-3 py-6 sm:px-4 md:py-8 lg:px-6">
        <FadeIn>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-950/65 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-orange-200 backdrop-blur transition hover:border-orange-500/60 hover:text-orange-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the journal
          </a>
        </FadeIn>

        <div className="max-w-6xl pb-8 pt-24 md:pt-32">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200 shadow-lg shadow-black/25 backdrop-blur">
              Tanzania safari cost guide
            </span>
            <h1 className="mt-5 max-w-5xl font-serif text-3xl font-semibold leading-[1.08] text-white md:text-5xl lg:text-6xl">
              {displayTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg">
              A practical day-by-day breakdown of budget, mid-range, and premium Tanzania safari costs, including when a short $1,500-style trip is realistic.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {costBands.map((band) => (
                <div
                  key={band.label}
                  className="rounded-lg border border-white/15 bg-slate-950/55 p-4 shadow-lg shadow-black/20 backdrop-blur"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200">
                    {band.label}
                  </div>
                  <div className="mt-2 font-serif text-2xl font-semibold text-white md:text-3xl">
                    {band.value}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-gray-300">
                    {band.detail}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#building-a-realistic-tanzania-safari-budget"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-700"
              >
                See cost tiers <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-5 py-3 text-sm font-semibold text-orange-100 backdrop-blur transition hover:border-orange-400/60 hover:text-orange-50"
              >
                Request exact quote
              </a>
              <span className="flex items-center gap-1.5 text-xs text-gray-300">
                <Calendar className="h-3.5 w-3.5 text-orange-300" /> {post.date}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-300">
                <Clock className="h-3.5 w-3.5 text-orange-300" /> {post.readTime} min read
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = allPosts.find((p) => p.slug === slug);
  const others = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center md:px-8">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-300">404</span>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-white md:text-5xl">
            This story hasn't been written yet
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            We're still drafting this piece in the field. Browse the rest of the journal in the meantime.
          </p>
          <a href="/blog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-red-700">
            <ArrowLeft className="h-4 w-4" /> Back to the journal
          </a>
        </div>
      </div>
    );
  }

  const postImage = getBlogPostImage(post.slug, post.image);
  const displayTitle = getBlogDisplayTitle(post);
  const answerQuote = getBlogAnswerQuote(post);

  return (
    <div className="min-h-screen bg-slate-900">
      <ReadingProgress />
      {post.slug === TANZANIA_COST_GUIDE_SLUG ? (
        <TanzaniaCostGuideHero post={post} postImage={postImage} displayTitle={displayTitle} />
      ) : (
        <>

{/* ── HERO ── fits viewport height, dark overlay for text legibility ────── */}
     {/* CINEMATIC HERO — sized to fit a laptop screen */}
      <section className="relative isolate h-[80vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={postImage}
          alt={displayTitle}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-900" />

        {/* Back link top-left */}
        <div className="absolute left-0 right-0 top-0">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-6">
            <FadeIn>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-orange-300 backdrop-blur transition hover:border-orange-500/60 hover:text-orange-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to the journal
              </a>
            </FadeIn>
          </div>
        </div>

        {/* Title block at the very bottom — aligned with header container */}
        <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200 shadow-lg shadow-black/25 backdrop-blur">
                {post.category}
              </span>
              <h1 className="mt-4 font-serif text-2xl font-semibold leading-[1.15] text-white md:text-4xl lg:text-5xl">
                {displayTitle}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-orange-400" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-orange-400" /> {post.readTime} min read
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
        </>
      )}

      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">

            {/* ARTICLE */}
            <article className="min-w-0">

              {/* Excerpt — italic */}
              <FadeIn>
                <p className="font-serif text-base italic leading-relaxed text-gray-300 md:text-lg">
                  "{answerQuote}"
                </p>
              </FadeIn>

              {post.body ? (
                <>
                  <FadeIn>
                    {post.body.intro.map((p: string, i: number) =>
                      i === 0 ? (
                        <p key={i} className="mt-8 text-base leading-relaxed text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-orange-300">
                          {p}
                        </p>
                      ) : (
                        <p key={i} className="mt-4 text-base leading-relaxed text-gray-300">{p}</p>
                      )
                    )}
                  </FadeIn>
                  <RichBody sections={post.body.sections} postImage={postImage} postSlug={post.slug} />
                  <FadeIn>
                    <div className="mt-10">
                      {post.body.closing.map((p: string, i: number) => (
                        <p key={i} className="mt-4 text-base leading-relaxed text-gray-300">{p}</p>
                      ))}
                    </div>
                  </FadeIn>
                </>
              ) : (
                <>
                  {/* Drop-cap lede */}
                  <FadeIn>
                    <p className="mt-8 text-base leading-relaxed text-gray-300 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-orange-300">
                      This is the kind of question we get every week — and the honest answer has more nuance
                      than most travel blogs will admit. What follows is a decade of curating safaris across
                      East Africa, distilled into the conversation we wish someone had given us when we first
                      started planning our own trips.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-gray-300">
                      There's a quiet truth in this industry that no glossy brochure will tell you: the best
                      safari is rarely the most expensive one, and it's almost never the one with the longest
                      list of inclusions. It's the one designed around <em>you</em> — your pace, your
                      patience, your appetite for early mornings, and the moments you'd want to remember on a
                      Tuesday afternoon five years from now.
                    </p>
                  </FadeIn>

                  {/* Section 1 */}
                  <FadeIn>
                    <h2 id="why-it-matters" className="mt-12 scroll-mt-28 font-serif text-2xl font-bold text-white md:text-3xl">
                      Why this question matters
                    </h2>
                    <figure className="my-6 overflow-hidden rounded-2xl">
                      <img src={postImage} alt="Why this question matters" loading="lazy"
                        className="h-64 w-full object-cover md:h-72" />
                    </figure>
                    <p className="mt-5 text-base leading-relaxed text-gray-300">
                      The decision you make here shapes everything that follows — your budget, your itinerary,
                      the lodges you'll fall in love with, and the photographs you'll show your friends for years.
                      It deserves a real answer, not a recycled top-10 list.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-gray-300">
                      We've sat across the table from over a thousand first-time travellers, and the same handful
                      of misunderstandings show up again and again. The next ten minutes of reading will save you,
                      on average, the equivalent of a domestic flight and two nights in the wrong lodge.
                    </p>
                  </FadeIn>

                  {/* Section 2 */}
                  <FadeIn>
                    <h2 id="the-setting" className="mt-12 scroll-mt-28 font-serif text-2xl font-bold text-white md:text-3xl">
                      The setting
                    </h2>
                    <figure className="my-6 overflow-hidden rounded-2xl">
                      <img src={postImage} alt="The setting" loading="lazy"
                        className="h-64 w-full object-cover md:h-72" />
                    </figure>
                    <p className="mt-5 text-base leading-relaxed text-gray-300">
                      Picture this: it's 5:47 a.m. and the savannah is completely still. The acacia trees are
                      silhouetted against a sky the colour of blood oranges, and somewhere half a kilometre away
                      a lion coughs once — that low, hollow sound that travels further than you'd believe. Your
                      guide cuts the engine. You forget, for a full minute, that you have an inbox.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-gray-300">
                      This is the moment our travellers tell us about years later. Not the lodge. Not the
                      in-flight champagne. This. And here's the thing — you can't book that moment. You can
                      only set the conditions for it to find you.
                    </p>
                  </FadeIn>

                  {/* Pull quote */}
                  <FadeIn>
                    <figure className="my-8 rounded-2xl border-l-4 border-orange-500 bg-slate-800/80 p-6 md:p-8">
                      <Quote className="h-7 w-7 text-orange-300" />
                      <blockquote className="mt-3 font-serif text-lg italic leading-snug text-gray-300 md:text-2xl">
                        "I read three articles before this one. None of them told me the things that actually
                        changed how we planned our trip."
                      </blockquote>
                      <figcaption className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-400">
                        — A traveller who became a return guest
                      </figcaption>
                    </figure>
                  </FadeIn>

                  {/* Section 3 — what we'll cover */}
                  <FadeIn>
                    <div id="what-well-cover" className="scroll-mt-28 rounded-2xl border border-slate-700 bg-slate-800/80 p-6 md:p-8">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-300">What we'll cover</span>
                      <h3 className="mt-2 font-serif text-xl font-semibold text-white md:text-2xl">
                        Five honest answers, in plain English.
                      </h3>
                      <ul className="mt-5 grid gap-3 md:grid-cols-2">
                        {[
                          "The real cost picture — fixed costs, hidden costs, and where premium money actually goes.",
                          "Wildlife and seasonality — when to be where, and why timing changes everything.",
                          "The questions to ask any operator before sending a deposit.",
                          'What "luxury" really buys you — beyond the marketing photography.',
                          "How to know if you're being sold a package versus a curated trip.",
                          "The small things that quietly make or break a 10-day itinerary.",
                        ].map((item, idx) => (
                          <li key={item} className="flex gap-3 rounded-xl bg-slate-700/60 p-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 font-serif text-xs font-semibold text-white">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>

                  {/* Section 4 */}
                  <FadeIn>
                    <h2 id="operators-wont-tell" className="mt-12 scroll-mt-28 font-serif text-2xl font-bold text-white md:text-3xl">
                      The story most operators won't tell you
                    </h2>
                    <figure className="my-6 overflow-hidden rounded-2xl">
                      <img src={postImage} alt="Operators" loading="lazy"
                        className="h-48 w-full object-cover md:h-56" />
                    </figure>
                    <p className="mt-5 text-base leading-relaxed text-gray-300">
                      Here's the part that took us five years to learn: there is no "best" itinerary. The trip
                      that changes one traveller's life would bore another to tears.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-gray-300">
                      The right safari company doesn't sell you a destination. They listen for the trip you
                      don't yet know you want — and then build it around the life you actually live. That's
                      why our planning calls last 45 minutes, not five.
                    </p>
                  </FadeIn>

                  {/* Pro tip */}
                  <FadeIn>
                    <div className="my-8 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-600/5 p-6 md:p-8">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                          <Lightbulb className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                          Pro tip from the field
                        </span>
                      </div>
                      <p className="mt-4 font-serif text-lg leading-relaxed text-gray-300">
                        Book your safari around the wildlife event you most want to see — then build the rest
                        of the trip around that anchor.
                      </p>
                    </div>
                  </FadeIn>

                  {/* Three observations */}
                  <FadeIn>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { icon: Eye, title: "Watch how they listen", body: "A planner who keeps redirecting you to a packaged itinerary isn't curating — they're selling." },
                        { icon: MapPin, title: "Geography over brand", body: "Two camps with the same logo can sit in completely different ecosystems. Always ask what's outside the gate." },
                        { icon: Compass, title: "Pacing is everything", body: "Three nights minimum per location. Anything less and you'll spend half the trip on transfer roads." },
                      ].map((c) => (
                        <div key={c.title} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                            <c.icon className="h-4 w-4" />
                          </span>
                          <h3 className="mt-4 font-serif text-base font-semibold text-white">{c.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-gray-300">{c.body}</p>
                        </div>
                      ))}
                    </div>
                  </FadeIn>

                  {/* Section 5 */}
                  <FadeIn>
                    <h2 id="bottom-line" className="mt-12 scroll-mt-28 font-serif text-2xl font-bold text-white md:text-3xl">
                      The honest bottom line
                    </h2>
                    <figure className="my-6 overflow-hidden rounded-2xl">
                      <img src={postImage} alt="Bottom line" loading="lazy"
                        className="h-48 w-full object-cover md:h-56" />
                    </figure>
                    <p className="mt-5 text-base leading-relaxed text-gray-300">
                      Every safari we've curated has had a different right answer to this question. The best
                      operators don't push a destination — they listen to what you want, then suggest the trip
                      that actually fits. If a planner gives you a quote before asking you a dozen questions,
                      you're talking to the wrong person.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-gray-300">
                      We'll keep updating this piece as the season shifts and new lodges open. If you have a
                      specific question, write to us — a real human will write back within a day.
                    </p>
                  </FadeIn>
                </>
              )}

              {/* Author block */}
              <FadeIn>
                <div className="mt-10 flex items-start gap-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-5 md:p-6">
                  <div
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full p-1 shadow-[0_0_28px_rgba(249,115,22,0.3)]"
                    style={{
                      background:
                        "radial-gradient(circle at 34% 28%, rgba(251, 146, 60, 0.8), rgba(234, 88, 12, 0.34) 48%, rgba(15, 23, 42, 0.86) 100%)",
                    }}
                  >
                    <img
                      src={authorImage}
                      alt="Ian Ng'ang'a"
                      loading="lazy"
                      className="relative h-full w-full rounded-full border border-orange-500/40 object-cover object-[50%_24%]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">
                      <MapPin className="h-3 w-3" /> Written from Narok, Kenya
                    </div>
                    <div className="mt-0.5 font-serif text-base font-bold text-white">
                      Ian Ng'ang'a · Lead Safari Curator
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                      Kenya-based and hands-on, Ian brings a fresh, detail-driven eye to safari planning: honest
                      lodge choices, practical routes, and guest care that feels personal.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* CTA block */}
              <FadeIn>
                <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-8 text-center md:p-10">
                  <h3 className="font-serif text-2xl font-semibold text-white md:text-3xl">
                    Ready to plan yours?
                  </h3>
                  <p className="max-w-lg text-sm text-gray-300">
                    Tell us what you're dreaming about. We'll design the rest — with a long, honest
                    conversation, no pressure, no template.
                  </p>
                  <a href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-red-700 hover:shadow-xl">
                    Talk to a safari expert <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </FadeIn>
            </article>

            {/* SIDEBAR */}
            <ArticleSidebar post={post} />
          </div>
        </div>
      </div>

      {/* ── KEEP READING ── */}
          {/* MORE */}
      <section className="border-t border-slate-700/60 py-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <FadeIn>
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl">
                Keep reading
              </h2>
              <a
                href="/blog"
                className="text-sm font-semibold text-orange-300 hover:text-orange-200 hover:underline"
              >
                All stories →
              </a>
            </div>
          </FadeIn>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 transition-all duration-500 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-glow">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getBlogPostImage(p.slug, p.image)}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-orange-400/60 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-200 shadow-lg shadow-black/25 backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-serif text-lg font-semibold leading-snug text-white transition-colors group-hover:text-orange-300">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300 line-clamp-2">
                      {getBlogAnswerQuote(p)}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>{p.date}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-orange-400" /> {p.readTime} min read
                      </span>
                    </div>
                    <div className="mt-4 flex justify-start pt-1">
                      <ReadButton to="/blog/$slug" params={{ slug: p.slug }} />
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
