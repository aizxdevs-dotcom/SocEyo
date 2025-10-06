"use client";

import React from "react";
import PostCard from "./PostCard";

interface FeedListProps {
  posts: any[];
}

export default function FeedList({ posts }: FeedListProps) {
  return (
    <div className="flex flex-col gap-6">
      {posts.map((post, index) => (
        <PostCard key={post.id ?? index} post={post} />
      ))}
    </div>
  );
}