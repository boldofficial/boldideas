"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  publishedAt: Date | null;
  coverImage: string | null;
}

interface BlogIndexPageProps {
  posts: Post[];
}

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ posts }) => {
  const [featuredPost, otherPosts] = useMemo(() => {
    if (!posts || posts.length === 0) return [null, []];
    const [latest, ...rest] = posts;
    return [latest, rest];
  }, [posts]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* ═══════════════════════════════════════════════════════════════
            PAGE HEADER
           ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-brand-navy pt-24 pb-12 md:pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,186,81,0.15),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(75,143,191,0.15),transparent_32%),linear-gradient(135deg,#061b35_0%,#082849_56%,#0b355f_100%)]" />

          <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
            <nav
              className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/60"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="transition hover:text-brand-gold">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-brand-gold" aria-current="page">
                Blog
              </span>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-6 inline-flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-gold">
                  <MapPin className="h-4 w-4" />
                  Illinois & Wisconsin
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/78">
                  <Sparkles className="h-4 w-4" />
                  Insights & Ideas
                </span>
              </div>

              <h1
                className={`max-w-3xl text-3xl font-extrabold text-white md:text-4xl lg:text-5xl`}
              >
                Practical insights for{" "}
                <span className="text-brand-gold">local business growth</span>.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Articles on websites, AI agents, workflow automation, and digital
                marketing for Illinois and Wisconsin small businesses.
              </p>
            </div>
          </div>
        </section>

        {!featuredPost ? (
          // ═══════════════════════════════════════════════════════════════
          // EMPTY STATE
          // ═══════════════════════════════════════════════════════════════
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-[720px] px-6 text-center md:px-12">
              <Search className="mx-auto h-12 w-12 text-slate-200" />
              <h2
                className={`mt-6 text-2xl font-bold text-brand-navy md:text-3xl`}
              >
                No articles published yet
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                Check back soon for practical guides on websites, AI agents, and
                workflow automation for local businesses.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════════
                FEATURED POST
               ═══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden py-16 md:py-20">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
              <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                  Latest article
                </p>
                <h2
                  className={`mt-3 text-2xl font-bold leading-tight text-brand-navy md:text-3xl`}
                >
                  Featured post
                </h2>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group mt-8 block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                >
                  <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                    {/* Featured image */}
                    <div className="relative min-h-[240px] overflow-hidden bg-slate-100 md:min-h-[320px]">
                      {featuredPost.coverImage ? (
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                              <Sparkles className="h-8 w-8" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-8 md:p-10">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                          {featuredPost.publishedAt
                            ? new Date(
                                featuredPost.publishedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Coming soon"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-brand-gold" />
                          {Math.ceil(
                            JSON.stringify(featuredPost.content).length / 1000
                          )}{" "}
                          min read
                        </span>
                      </div>

                      <h3
                        className={`mt-4 text-xl font-bold leading-tight text-brand-navy transition-colors group-hover:text-brand-gold md:text-2xl`}
                      >
                        {featuredPost.title}
                      </h3>

                      {featuredPost.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                          {featuredPost.excerpt}
                        </p>
                      )}

                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all group-hover:gap-3">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                POST GRID
               ═══════════════════════════════════════════════════════════ */}
            {otherPosts.length > 0 && (
              <section className="pb-14 md:pb-20">
                <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
                  <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                        More articles
                      </p>
                      <h2
                        className={`mt-2 text-2xl font-bold text-brand-navy md:text-3xl`}
                      >
                        All posts
                      </h2>
                    </div>
                    <p className="hidden text-sm text-slate-500 md:block">
                      {posts.length} article{posts.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl"
                      >
                        {/* Card image */}
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Sparkles className="h-10 w-10 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Card content */}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-brand-gold" />
                              {post.publishedAt
                                ? new Date(
                                    post.publishedAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Coming soon"}
                            </span>
                          </div>

                          <h3
                            className={`mt-3 text-lg font-bold leading-tight text-brand-navy transition-colors group-hover:text-brand-gold`}
                          >
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-slate-600">
                              {post.excerpt}
                            </p>
                          )}

                          <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-brand-gold transition-all group-hover:gap-3">
                            Read
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════════════
                CTA SECTION
               ═══════════════════════════════════════════════════════════ */}
            <section className="bg-slate-50 py-14 md:py-20">
              <div className="mx-auto max-w-[1180px] px-6 md:px-12 lg:px-20">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-14">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-gold/5 blur-3xl" />
                  <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand-navy/5 blur-3xl" />

                  <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-gold">
                        Let us help
                      </p>
                      <h2
                        className={`mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl`}
                      >
                        Ready to put these ideas into practice?
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                        Whether you need a website, an AI agent, or connected
                        follow-up systems — we build practical solutions for
                        Illinois and Wisconsin businesses.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                      <Link
                        href="/book"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-navy px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl transition hover:bg-brand-gold hover:text-brand-navy"
                      >
                        Book a strategy call
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
                      >
                        Send a message
                      </Link>
                    </div>
                  </div>

                  <div className="relative mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-slate-100 pt-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Explore:
                    </span>
                    <Link
                      href="/services"
                      className="text-xs font-bold text-brand-navy transition hover:text-brand-gold"
                    >
                      Services
                    </Link>
                    <Link
                      href="/about"
                      className="text-xs font-bold text-brand-navy transition hover:text-brand-gold"
                    >
                      About us
                    </Link>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-brand-navy transition hover:text-brand-gold"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndexPage;
