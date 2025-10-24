"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import PostCard from "@/components/Feed/PostCard";
import AccountSettingsModal from "@/components/ui/AccountSettingsModal";
import {
  updateUser,
  uploadProfilePhoto,
  getUserPosts,
} from "@/services/users";
import { getMe } from "@/services/auth";
import type { Post } from "@/services/posts";

interface User {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  bio?: string;
  photo_url?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Load user and posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const me = await getMe();
        if (!me?.id) return;

        setUser(me);
        setUsername(me.username);
        setFullName(me.full_name || "");
        setEmail(me.email);
        setBio(me.bio || "");
        const userPosts = await getUserPosts(me.id);
        setPosts(userPosts);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    try {
      setLoading(true);
      await uploadProfilePhoto(user.id, file);
      const latest = await getMe();
      setUser(latest);
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      await updateUser(user.id, {
        username,
        email,
        bio,
        full_name: fullName,
      });
      const latest = await getMe();
      setUser(latest);
      alert("Profile information saved!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const photoSrc = user?.photo_url
  ? `${process.env.NEXT_PUBLIC_API_URL || ""}${user.photo_url}?t=${Date.now()}`
  : "/default-avatar.png";

  const handleDeleteSuccess = () => {
    setShowSettings(false);
    setSuccessMessage("Account deleted successfully");
    setShowSuccessToast(true);
    
    // Clear auth and redirect after toast
    setTimeout(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/");
    }, 2000);
  };

  const handlePasswordUpdateSuccess = () => {
    setSuccessMessage("Password updated successfully");
    setShowSuccessToast(true);
    setShowSettings(false);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      <Navbar />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
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
            <span className="font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Settings Modal */}
      {user && (
        <AccountSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userId={user.id}
          onDeleteSuccess={handleDeleteSuccess}
          onPasswordUpdateSuccess={handlePasswordUpdateSuccess}
        />
      )}

      <main className="flex-grow px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
          {/* ---------- Profile Settings ---------- */}
          <section>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold">Profile</h1>
              <Button
                onClick={() => setShowSettings(true)}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-4 py-2 text-sm font-medium flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-y-4">
                <img
                  src={photoSrc}
                  alt="Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-gray-300 object-cover mx-auto sm:mx-0"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
                    Change Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-600
                               file:mr-3 file:py-2 file:px-3
                               file:rounded-md file:border-0
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Editable Info */}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="w-full min-h-[100px] resize-none border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </section>

          {/* ---------- Posts ---------- */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5">
              Your Posts
            </h2>
            {posts.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">
                You haven’t posted anything yet.
              </p>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.post_id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="py-4 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}