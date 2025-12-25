import React, { useState, useEffect } from 'react';
import API from '../api/Axios';
import AuthStore from '../store/AuthStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCode, 
  FaHistory,
  FaStar,
  FaUsers,
  FaImage
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const user = AuthStore((state) => state.user);
  const setAuthInfo = AuthStore((state) => state.setAuthInfo);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ repos: 0, commits: 0, stars: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/UserProfile');
      setProfileData(res.data.userData);
      setFormData({
        username: res.data.userData.username,
        email: res.data.userData.email,
        profileImage: res.data.userData.profileImage || '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const reposRes = await API.get('/repo/user');
      const repos = reposRes.data.repositories || [];
      
      let totalCommits = 0;
      for (const repo of repos) {
        try {
          const commitsRes = await API.get(`/repo/${repo._id}/log`);
          totalCommits += (commitsRes.data.commits || []).length;
        } catch (err) {
          // Ignore errors for repos without commits
        }
      }

      setStats({
        repos: repos.length,
        commits: totalCommits,
        stars: repos.reduce((acc, repo) => acc + (repo.stars || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileData) {
      setFormData({
        username: profileData.username,
        email: profileData.email,
        profileImage: profileData.profileImage || '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const updateData = {};
      if (formData.username) updateData.username = formData.username;
      if (formData.password) updateData.password = formData.password;

      await API.put('/updateProfile', updateData);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
      
      // Update auth store if username changed
      if (formData.username && user) {
        const updatedUser = { ...user, username: formData.username };
        const token = AuthStore.getState().token;
        setAuthInfo(token, updatedUser);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-[#8b949e]">Manage your account settings and preferences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCode className="text-[#58a6ff] text-2xl" />
              <div>
                <p className="text-2xl font-bold">{stats.repos}</p>
                <p className="text-sm text-[#8b949e]">Repositories</p>
              </div>
            </div>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaHistory className="text-[#a5a5a5] text-2xl" />
              <div>
                <p className="text-2xl font-bold">{stats.commits}</p>
                <p className="text-sm text-[#8b949e]">Total Commits</p>
              </div>
            </div>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="text-[#f1e05a] text-2xl" />
              <div>
                <p className="text-2xl font-bold">{stats.stars}</p>
                <p className="text-sm text-[#8b949e]">Stars</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md text-sm"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaImage /> Profile Image URL
                </label>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                />
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="mt-2 w-24 h-24 rounded-full object-cover border border-[#30363d]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaUser /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-[#8b949e] mt-1">Email cannot be changed</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave empty to keep current password"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                />
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#30363d]">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md disabled:opacity-50"
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-[#30363d] hover:bg-[#484f58] rounded-md"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <img
                  src={profileData?.profileImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwVLdSDmgrZN7TkzbHJb8dD0_7ASUQuERL2A&s'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#30363d]"
                />
                <div>
                  <h3 className="text-2xl font-semibold">{profileData?.username}</h3>
                  <p className="text-[#8b949e]">{profileData?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CLI Configuration Section */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">CLI Configuration</h2>
          <p className="text-[#8b949e] mb-4">
            To use DevTrack CLI, you need to authenticate first. Run the following command in your terminal:
          </p>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
            <code className="text-[#58a6ff]">devtrack login</code>
          </div>
          <p className="text-xs text-[#8b949e] mt-4">
            After logging in, you can use all CLI commands and they will sync with this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
