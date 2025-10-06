"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import PostCard from "@/components/Feed/PostCard";
import { updateUser, uploadProfilePhoto, getUserPosts } from "@/services/users";
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
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load user data & posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const me = await getMe();
        if (!me || !me.id) {
          console.warn("⚠️ getMe() did not return a valid user ID.");
          return;
        }

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
      const updated = await uploadProfilePhoto(user.id, file);

      // 🚀 Immediately re-fetch the latest user object to ensure cache freshness
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
      const updated = await updateUser(user.id, {
        username,
        email,
        bio,
        full_name: fullName,
      });

      // re-fetch current user to capture any side effects
      const latest = await getMe();
      setUser(latest);

      alert("Profile information saved!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add cache-busting time param for image refresh
  const photoSrc =
    (user?.photo_url ? `${user.photo_url}?t=${Date.now()}` : "/default-avatar.png");

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />

      <main className="flex-grow px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* ---------- Profile Settings ---------- */}
          <section>
            <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={photoSrc}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border border-gray-300 object-cover"
                  />
                </div>

                <div className="mt-4 sm:mt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block text-sm text-gray-600
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full min-h-[100px] resize-none border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </section>

          {/* ---------- Posts ---------- */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
            {posts.length === 0 ? (
              <p className="text-gray-500">You haven’t posted anything yet.</p>
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

      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}