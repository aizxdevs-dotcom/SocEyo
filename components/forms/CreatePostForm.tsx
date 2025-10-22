"use client";

import { useState } from "react";
import { createPost } from "@/services/posts";
import Button from "@/components/ui/Button";

interface CreatePostFormProps {
  onSuccess?: () => void;   // 👈 notify parent when post created
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && files.length === 0) {
      alert("Please write something or attach a file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("description", description);

      await createPost(formData);

      setDescription("");
      setFiles([]);

      // 👇 trigger animation at parent
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create post, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] resize-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3 text-gray-900 text-sm sm:text-base"
        />

        {/* ---- Uploader + Button ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="block w-full sm:w-auto text-sm text-gray-600
                       file:mr-3 file:py-2 file:px-3
                       file:rounded-md file:border-0
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 text-sm sm:text-base"
          >
            {loading ? "Posting..." : "Share Post"}
          </Button>
        </div>

        {/* ---- File Previews ---- */}
        {files.length > 0 && (
          <div
            className={`grid gap-2 mt-3 ${
              files.length === 1
                ? "grid-cols-1"
                : files.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {files.map((file, idx) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative rounded-md overflow-hidden">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-36 object-cover rounded-md border border-gray-200"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      className="w-full h-36 object-cover rounded-md border border-gray-200"
                      muted
                      playsInline
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}