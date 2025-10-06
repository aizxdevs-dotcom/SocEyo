"use client";

import { useEffect, useState } from "react";
import CommentModal from "@/components/Feed/CommentModal";
import ReactionModal from "@/components/Feed/ReactionModal";
import Button from "@/components/ui/Button";
import { getMe } from "@/services/auth";
import type { Post } from "@/services/posts";
import { deletePost, updatePost } from "@/services/posts";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  photo_url?: string | null;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; type: string } | null>(
    null
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(post.description);

  // Load current logged‑in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };
    fetchUser();
  }, []);

  // Separate images and videos
  const imageFiles = post.files?.filter((f) => f.file_type.startsWith("image/"));
  const videoFiles = post.files?.filter((f) => f.file_type.startsWith("video/"));

  // Lightbox handlers
  const openLightbox = (url: string, type: string) => setLightbox({ url, type });
  const closeLightbox = () => setLightbox(null);

  // Delete / Update post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post.post_id);
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePost(post.post_id, newDescription);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update post.");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 transition hover:shadow-md">
        {/* ---- Author header ---- */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.user_profile_url || "/default-avatar.png"}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="font-medium text-gray-900">
                {post.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* ---- three‑dot menu ---- */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <EllipsisVertical className="w-5 h-5 text-gray-600" />
            </button>
            {menuOpen && user?.id === post.user_id && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---- Description / edit ---- */}
        {isEditing ? (
          <div className="mb-4">
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          post.description && (
            <p className="text-gray-800 mb-4 whitespace-pre-line">
              {post.description}
            </p>
          )
        )}

        {/* ---- Images ---- */}
        {imageFiles?.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${
              imageFiles.length === 1
                ? "grid-cols-1"
                : imageFiles.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {imageFiles.map((img) => (
              <img
                key={img.file_id}
                src={img.url}
                alt="Post image"
                onClick={() => openLightbox(img.url, "image")}
                className="w-full h-64 object-cover rounded-md border border-gray-200 hover:opacity-90 transition cursor-pointer"
              />
            ))}
          </div>
        )}

        {/* ---- Videos ---- */}
        {videoFiles?.length > 0 && (
          <div
            className={`grid gap-3 mb-4 ${
              videoFiles.length === 1
                ? "grid-cols-1"
                : videoFiles.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {videoFiles.map((vid) => (
              <video
                key={vid.file_id}
                controls
                onClick={() => openLightbox(vid.url, "video")}
                className="w-full h-64 rounded-md border border-gray-200 object-cover cursor-pointer hover:opacity-90 transition"
              >
                <source src={vid.url} type={vid.file_type} />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        )}

        {/* ---- Footer actions ---- */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => setShowReactions(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm font-medium"
          >
            React
          </Button>
          <Button
            type="button"
            onClick={() => setShowComments(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
          >
            Comments
          </Button>
        </div>
      </div>

      {/* ---- Comment Modal ---- */}
      <CommentModal
        postId={post.post_id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* ---- Reaction Modal ---- */}
      <ReactionModal
        postId={post.post_id}
        isOpen={showReactions}
        onClose={() => setShowReactions(false)}
      />

      {/* ---- Lightbox Modal ---- */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity"
        >
          <div className="relative max-w-5xl w-full px-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300"
            >
              &times;
            </button>

            {lightbox.type === "image" ? (
              <img
                src={lightbox.url}
                alt="Fullscreen image"
                className="max-h-[90vh] w-full object-contain rounded-md mx-auto"
              />
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="max-h-[90vh] w-full rounded-md mx-auto"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}