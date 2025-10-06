"use client";

import { useEffect, useState } from "react";
import { addComment, addCommentWithFiles, getComments } from "@/services/posts";
import Button from "@/components/ui/Button";

interface FilePreview {
  url: string;
  name: string;
  file: File;
}

interface Comment {
  comment_id: string;
  description: string;
  created_at: string;
  user_id: string;
  username?: string;
  user_profile_url?: string;
  files?: {
    file_id: string;
    url: string;
    file_type: string;
    size: number;
  }[];
}

interface CommentModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({ postId, isOpen, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getComments(postId);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [isOpen, postId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setSelectedFiles(previews);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && selectedFiles.length === 0) return;
    try {
      setSubmitting(true);

      const created = selectedFiles.length > 0
        ? await addCommentWithFiles(postId, newComment.trim(), selectedFiles.map((f) => f.file))
        : await addComment(postId, newComment.trim());

      setComments((prev) => [created, ...prev]);
      setNewComment("");
      setSelectedFiles([]);
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-5 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none text-lg"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="max-h-[400px] overflow-y-auto space-y-4 mb-6 pr-1">
          {loading ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.comment_id}
                className="flex gap-3 border border-gray-200 rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <img
                  src={c.user_profile_url || "/default-avatar.png"}
                  alt={c.username || "User"}
                  className="h-10 w-10 rounded-full object-cover border border-gray-300"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">
                      {c.username || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{c.description}</p>
                  {c.files?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {c.files.map((f) => (
                        <img
                          key={f.file_id}
                          src={f.url}
                          alt="Attachment"
                          className="h-28 max-w-[120px] rounded-md object-cover cursor-pointer hover:opacity-90"
                          onClick={() => window.open(f.url, "_blank")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Comment */}
        <form onSubmit={handleAddComment} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[70px] resize-none border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
          />

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1">
              {selectedFiles.map((f) => (
                <img
                  key={f.name}
                  src={f.url}
                  alt={f.name}
                  className="h-16 w-16 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="w-full sm:w-auto text-sm text-gray-600
                       file:mr-3 file:py-2 file:px-3
                       file:rounded-md file:border-0
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
            />

            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium"
            >
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}