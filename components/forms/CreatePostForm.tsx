"use client";

import { useState } from "react";
import { createPost } from "@/services/posts";
import Button from "@/components/ui/Button";

export default function CreatePostForm() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !file) {
      alert("Please write something or attach a file.");
      return;
    }

    try {
      setLoading(true);
      if (file) await createPost(file, description);
      else await createPost(new File([], ""), description);

      setDescription("");
      setFile(null);
      alert("Your post has been shared!");
    } catch (err) {
      console.error(err);
      alert("Failed to create post, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] resize-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3 text-gray-900"
          />
        </div>

        {/* File attachment */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600
                       file:mr-3 file:py-2 file:px-3
                       file:rounded-md file:border-0
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />

          {/* Post button */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2"
          >
            {loading ? "Posting..." : "Share Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}