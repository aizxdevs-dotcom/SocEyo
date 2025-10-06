"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CreatePostForm from "@/components/forms/CreatePostForm";
import PostCard from "@/components/Feed/PostCard";
import { getFeed, Post } from "@/services/posts";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Load the global feed on mount
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await getFeed();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Feed Area */}
      <main className="flex-grow px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Post creation form */}
          <CreatePostForm />

          {/* Feed section */}
          <section className="space-y-6">
            {loading ? (
              <p className="text-center text-sm text-gray-500">Loading feed...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                No posts yet. Be the first to share something!
              </p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}