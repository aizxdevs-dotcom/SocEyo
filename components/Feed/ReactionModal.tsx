"use client";

import { useEffect, useState } from "react";
import {
  FaThumbsUp,
  FaLaughSquint,
  FaHeart,
  FaSadTear,
  FaAngry,
} from "react-icons/fa";
import { getReactions, reactToPost } from "@/services/posts";
import { getMe } from "@/services/auth";
import Button from "@/components/ui/Button";

interface ReactionModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ReactionUser {
  reaction_id: string;
  type: string;
  user_id: string;
  username?: string;
  user_profile_url?: string;
}

export default function ReactionModal({
  postId,
  isOpen,
  onClose,
}: ReactionModalProps) {
  const [user, setUser] = useState<any>(null);
  const [reactions, setReactions] = useState<ReactionUser[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Available reaction types
  const availableReactions = [
    { type: "like", icon: <FaThumbsUp className="w-8 h-8 text-blue-600" /> },
    { type: "haha", icon: <FaLaughSquint className="w-8 h-8 text-yellow-500" /> },
    { type: "care", icon: <FaHeart className="w-8 h-8 text-red-500" /> },
    { type: "sad", icon: <FaSadTear className="w-8 h-8 text-blue-400" /> },
    { type: "angry", icon: <FaAngry className="w-8 h-8 text-orange-600" /> },
  ];

  // --- Fetch user and reactions
  useEffect(() => {
    if (!isOpen) return;
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const [me, list] = await Promise.all([
          getMe(),
          getReactions(postId as any),
        ]);
        setUser(me);
        setReactions(list);
        const mine = list.find((r) => r.user_id === me.id);
        setSelectedReaction(mine?.type || null);
      } catch (err) {
        console.error("Failed to fetch reactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReactions();
  }, [isOpen, postId]);

  const handleReact = async (type: string) => {
    try {
      if (!user) return alert("You must be logged in to react.");
      setSubmitting(true);
      await reactToPost(postId as any, type);
      setSelectedReaction(type);
      const refreshed = await getReactions(postId as any);
      setReactions(refreshed);
    } catch (err) {
      console.error("Reaction failed:", err);
      alert("Unable to send reaction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 sm:p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            React to Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Reaction Icons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
          {availableReactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleReact(r.type)}
              disabled={submitting}
              title={r.type}
              className={`p-2 rounded-full hover:scale-110 transition-transform ${
                selectedReaction === r.type
                  ? "bg-gray-100 ring-2 ring-blue-500"
                  : ""
              }`}
            >
              {r.icon}
            </button>
          ))}
        </div>

        {/* Reaction List */}
        {loading ? (
          <p className="text-sm text-gray-500 text-center">Loading reactions…</p>
        ) : reactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">
            Nobody has reacted yet. Be the first!
          </p>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-3 border-t pt-3 pr-1">
            {reactions.map((r) => {
              const matched = availableReactions.find((a) => a.type === r.type);
              return (
                <div
                  key={r.reaction_id}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.user_profile_url || "/default-avatar.png"}
                      alt={r.username}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 object-cover"
                    />
                    <span className="text-sm sm:text-base text-gray-800 font-medium">
                      {r.username}
                    </span>
                  </div>
                  <div>{matched?.icon}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-1.5 sm:px-6 rounded-md text-sm sm:text-base font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}