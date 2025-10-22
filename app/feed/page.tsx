"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CreatePostForm from "@/components/forms/CreatePostForm";
import PostCard from "@/components/Feed/PostCard";
import { getFeed, Post } from "@/services/posts";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 👈 added toast state

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        else setRefreshing(true);

        const data = await getFeed();
        if (isMounted) setPosts(data);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        if (isMounted) {
          if (isInitial) setLoading(false);
          else setRefreshing(false);
        }
      }
    };

    fetchFeed(true);
    const intervalId = setInterval(() => fetchFeed(false), 60000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // 👇 callback to refresh & animate
  const handlePostSuccess = async () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
    const updated = await getFeed();
    setPosts(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      <Navbar />

      {/* ✅ Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Post Successfully Created!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8 relative">
          {/* 👇 pass callback */}
          <CreatePostForm onSuccess={handlePostSuccess} />

          <section className="space-y-6 relative">
            {refreshing && (
              <div className="absolute inset-0 flex justify-center pt-8 z-10 pointer-events-none">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No posts yet. Be the first to share something!
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.post_id} post={post} />)
            )}
          </section>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}