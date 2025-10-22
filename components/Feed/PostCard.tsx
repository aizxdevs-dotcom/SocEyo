"use client";

import { useEffect, useState } from "react";
import CommentModal from "@/components/Feed/CommentModal";
import ReactionModal from "@/components/Feed/ReactionModal";
import Button from "@/components/ui/Button";
import { getMe } from "@/services/auth";
import type { Post } from "@/services/posts";
import { deletePost, updatePost } from "@/services/posts";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false); // 👈 new state for delete-confirmation modal
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; type: string } | null>(
    null
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(post.description);

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

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, message: "" }), 2500);
    return () => clearTimeout(t);
  }, [toast.show]);

  const imageFiles = post.files?.filter((f) => f.file_type.startsWith("image/"));
  const videoFiles = post.files?.filter((f) => f.file_type.startsWith("video/"));

  const openLightbox = (url: string, type: string) => setLightbox({ url, type });
  const closeLightbox = () => setLightbox(null);

  // --- Delete with a modal confirmation ---
  const handleDeleteConfirmed = async () => {
    try {
      await deletePost(post.post_id);
      setConfirmOpen(false);
      setToast({ show: true, message: "Post deleted successfully!" });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePost(post.post_id, newDescription);
      setIsEditing(false);
      setToast({ show: true, message: "Post updated successfully!" });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update post.");
    }
  };

  const renderMediaGrid = (media: any[], type: "image" | "video") => {
    if (media.length === 1) {
      const file = media[0];
      return (
        <div className="mb-4 rounded-md overflow-hidden">
          {type === "image" ? (
            <img
              src={file.url}
              alt="Post image"
              onClick={() => openLightbox(file.url, type)}
              className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition"
            />
          ) : (
            <video
              controls
              onClick={() => openLightbox(file.url, type)}
              className="w-full max-h-96 rounded-md cursor-pointer hover:opacity-90 transition"
            >
              <source src={file.url} type={file.file_type} />
            </video>
          )}
        </div>
      );
    }

    if (media.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {media.map((file) =>
            type === "image" ? (
              <img
                key={file.file_id}
                src={file.url}
                alt="Post image"
                onClick={() => openLightbox(file.url, type)}
                className="w-full max-h-72 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition"
              />
            ) : (
              <video
                key={file.file_id}
                controls
                onClick={() => openLightbox(file.url, type)}
                className="w-full max-h-72 rounded-md border border-gray-200 object-cover cursor-pointer hover:opacity-90 transition"
              >
                <source src={file.url} type={file.file_type} />
              </video>
            )
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-2 mb-4">
        <div className="w-full rounded-md overflow-hidden">
          {type === "image" ? (
            <img
              src={media[0].url}
              alt="Post main"
              onClick={() => openLightbox(media[0].url, type)}
              className="w-full sm:max-h-80 object-cover cursor-pointer hover:opacity-90 transition"
            />
          ) : (
            <video
              controls
              onClick={() => openLightbox(media[0].url, type)}
              className="w-full sm:max-h-80 rounded-md object-cover cursor-pointer hover:opacity-90 transition"
            >
              <source src={media[0].url} type={media[0].file_type} />
            </video>
          )}
        </div>
        <div
          className={`grid ${
            media.length === 3 ? "grid-cols-2" : "grid-cols-3"
          } gap-2`}
        >
          {media.slice(1, type === "image" ? 4 : 4).map((file, idx) => (
            <div key={file.file_id} className="relative">
              {type === "image" ? (
                <img
                  src={file.url}
                  alt={`Post media ${idx}`}
                  onClick={() => openLightbox(file.url, type)}
                  className="w-full h-44 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-90 transition"
                />
              ) : (
                <video
                  controls
                  onClick={() => openLightbox(file.url, type)}
                  className="w-full h-44 rounded-md border border-gray-200 object-cover cursor-pointer hover:opacity-90 transition"
                >
                  <source src={file.url} type={file.file_type} />
                </video>
              )}
              {media.length > 4 && idx === 2 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md text-white font-semibold text-lg">
                  +{media.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 mb-4 transition hover:shadow-md break-words">
        {/* ---- Author header ---- */}
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.user_profile_url || "/default-avatar.png"}
              alt="User avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {post.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* ---- three-dot menu ---- */}
          <div className="relative mt-2 sm:mt-0">
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
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
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
              className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 sm:px-4 py-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1 text-sm"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          post.description && (
            <p className="text-gray-800 mb-4 whitespace-pre-line text-sm sm:text-base">
              {post.description}
            </p>
          )
        )}

        {/* ---- Images/Videos ---- */}
        {imageFiles?.length > 0 && renderMediaGrid(imageFiles, "image")}
        {videoFiles?.length > 0 && renderMediaGrid(videoFiles, "video")}

        {/* ---- Footer actions ---- */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            onClick={() => setShowReactions(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm font-medium w-full sm:w-auto"
          >
            React
          </Button>
          <Button
            type="button"
            onClick={() => setShowComments(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium w-full sm:w-auto"
          >
            Comments
          </Button>
        </div>
      </div>

      {/* ---- Comment & Reaction Modals ---- */}
      <CommentModal
        postId={post.post_id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
      <ReactionModal
        postId={post.post_id}
        isOpen={showReactions}
        onClose={() => setShowReactions(false)}
      />

      {/* ---- Lightbox ---- */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        >
          <div className="relative w-full max-w-5xl px-3 sm:px-4">
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-5 text-white text-3xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
            {lightbox.type === "image" ? (
              <img
                src={lightbox.url}
                alt="Fullscreen image"
                className="max-h-[85vh] w-full object-contain rounded-md mx-auto"
              />
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="max-h-[85vh] w-full rounded-md mx-auto"
              />
            )}
          </div>
        </div>
      )}

      {/* ---- Delete Confirm Modal ---- */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg shadow-lg px-6 pt-6 pb-5 max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete this post?
              </h3>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => setConfirmOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2"
                >
                  No
                </Button>
                <Button
                  onClick={handleDeleteConfirmed}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                >
                  Yes, Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}