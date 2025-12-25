import React, { useState } from "react";
import API from '../api/Axios';
import { useNavigate } from "react-router-dom";
import AuthStore from "../store/AuthStore";
import { toast } from "react-toastify";

const CreateRepository = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [error, setError] = useState("");
  const isAuthenticated = AuthStore((state) => state.isAuthenticated)
  const user = AuthStore((state) => state.user)
  console.log(user)
    if(!user || !isAuthenticated)
    {
        navigate('/auth')
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return setError("Repository name is required");
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/repo/create", {
        owner:user.id,
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        content: formData.content,
      });

      toast.success("Repository created successfully 🚀");
      navigate(`/repo/${res.data.RepositoryId}`);
    } catch (err) {
        console.log(err)
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex justify-center py-10">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-2">
          Create a new repository
        </h1>
        <p className="text-[#8b949e] mb-6">
          A repository contains all project files, including the revision history.
        </p>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Repo Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Repository name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="my-repo"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-[#8b949e]">(optional)</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Visibility
              </label>

              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleChange}
                  />
                  <div>
                    <p className="font-medium">Public</p>
                    <p className="text-sm text-[#8b949e]">
                      Anyone on the internet can see this repository
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleChange}
                  />
                  <div>
                    <p className="font-medium">Private</p>
                    <p className="text-sm text-[#8b949e]">
                      Only you can see this repository
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Initial Content */}
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                Initial Content <span className="text-[#8b949e]">(optional)</span>
              </label>
              <textarea
                rows="4"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="README or initial code"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm"
              />
            </div> */}

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-[#30363d] pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;
