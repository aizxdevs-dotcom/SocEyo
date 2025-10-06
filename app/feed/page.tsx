"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CreatePostForm from "@/components/forms/CreatePostForm";
import PostCard from "@/components/Feed/PostCard";
import { getFeed, Post } from "@/services/posts";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);           // initial load
  const [refreshing, setRefreshing] = useState(false);    // later reloads

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

    // ---- Initial load ----
    fetchFeed(true);

    // ---- Auto-refresh every 60 seconds ----
    const intervalId = setInterval(() => fetchFeed(false), 60000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      <Navbar />

      <main className="flex-grow px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8 relative">
          <CreatePostForm />

          <section className="space-y-6 relative">
            {/* --- Spinner overlay during refresh (not hiding content) --- */}
            {refreshing && (
              <div className="absolute inset-0 flex justify-center pt-8 z-10 pointer-events-none">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* --- Initial load --- */}
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