import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/Axios';
import { toast } from 'react-toastify';
import AuthStore from '../store/AuthStore';
import { 
  FaCode, 
  FaHistory, 
  FaUpload, 
  FaDownload, 
  FaPlus, 
  FaCheck,
  FaArrowLeft 
} from 'react-icons/fa';

const RepoDetail = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const user = AuthStore((state) => state.user);
  
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files'); // 'files', 'commits', 'add'
  
  // Add file form
  const [newFile, setNewFile] = useState({ filename: '', content: '' });
  const [commitMessage, setCommitMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchRepo();
    fetchCommits();
    fetchStagedFiles();
  }, [repoId]);

  const fetchRepo = async () => {
    try {
      const res = await API.get(`/repo/${repoId}`);
      setRepo(res.data.repository);
      setIsInitialized(res.data.repository.initialized || false);
    } catch (error) {
      toast.error('Failed to load repository');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommits = async () => {
    try {
      const res = await API.get(`/repo/${repoId}/log`);
      setCommits(res.data.commits || []);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    }
  };

  const fetchStagedFiles = async () => {
    try {
      const res = await API.get(`/repo/${repoId}/staged`);
      setStagedFiles(res.data.stagedFiles || []);
    } catch (error) {
      console.error('Failed to fetch staged files:', error);
    }
  };

  const handleInit = async () => {
    try {
      await API.post(`/repo/${repoId}/init`);
      setIsInitialized(true);
      toast.success('Repository initialized successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize repository');
    }
  };

  const handleAddFile = async () => {
    if (!newFile.filename.trim() || !newFile.content.trim()) {
      toast.error('Please provide both filename and content');
      return;
    }

    try {
      await API.post(`/repo/${repoId}/add`, {
        files: [{
          filename: newFile.filename,
          content: newFile.content,
          path: newFile.filename
        }]
      });
      toast.success('File added to staging area');
      setNewFile({ filename: '', content: '' });
      fetchStagedFiles();
      setActiveTab('files');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add file');
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast.error('Please enter a commit message');
      return;
    }

    if (stagedFiles.length === 0) {
      toast.error('No files staged for commit');
      return;
    }

    try {
      await API.post(`/repo/${repoId}/commit`, { message: commitMessage });
      toast.success('Commit created successfully!');
      setCommitMessage('');
      fetchCommits();
      fetchStagedFiles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create commit');
    }
  };

  const handlePush = async () => {
    try {
      const res = await API.post(`/repo/${repoId}/push`);
      toast.success(`Push completed! ${res.data.uploaded} files uploaded`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to push commits');
    }
  };

  const handlePull = async () => {
    try {
      const res = await API.post(`/repo/${repoId}/pull`);
      toast.success(`Pull completed! ${res.data.pulledCommits} commits pulled`);
      fetchCommits();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to pull commits');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!repo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#8b949e] hover:text-[#e6edf3] mb-4"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                {repo.owner?.username}/{repo.name}
              </h1>
              <p className="text-[#8b949e] mt-1">{repo.description || 'No description'}</p>
            </div>
            <div className="flex gap-2">
              {!isInitialized && (
                <button
                  onClick={handleInit}
                  className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md text-sm"
                >
                  Initialize Repository
                </button>
              )}
              <button
                onClick={handlePush}
                className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md text-sm flex items-center gap-2"
              >
                <FaUpload /> Push
              </button>
              <button
                onClick={handlePull}
                className="px-4 py-2 bg-[#1f6feb] hover:bg-[#2c7cd6] rounded-md text-sm flex items-center gap-2"
              >
                <FaDownload /> Pull
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#30363d] mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('files')}
              className={`pb-3 px-2 border-b-2 ${
                activeTab === 'files'
                  ? 'border-[#f0883e] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              <FaCode className="inline mr-2" />
              Staged Files ({stagedFiles.length})
            </button>
            <button
              onClick={() => setActiveTab('commits')}
              className={`pb-3 px-2 border-b-2 ${
                activeTab === 'commits'
                  ? 'border-[#f0883e] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              <FaHistory className="inline mr-2" />
              Commits ({commits.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`pb-3 px-2 border-b-2 ${
                activeTab === 'add'
                  ? 'border-[#f0883e] text-[#e6edf3]'
                  : 'border-transparent text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              <FaPlus className="inline mr-2" />
              Add File
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
          {activeTab === 'files' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Staged Files</h2>
              {stagedFiles.length === 0 ? (
                <p className="text-[#8b949e]">No files staged. Add files to get started.</p>
              ) : (
                <div className="space-y-2">
                  {stagedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#0d1117] rounded border border-[#30363d]"
                    >
                      <div>
                        <p className="font-medium">{file.filename}</p>
                        <p className="text-sm text-[#8b949e]">
                          {file.content?.length || 0} characters
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {stagedFiles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#30363d]">
                  <h3 className="text-lg font-semibold mb-3">Commit Changes</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="Enter commit message..."
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                    />
                    <button
                      onClick={handleCommit}
                      className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md flex items-center gap-2"
                    >
                      <FaCheck /> Commit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'commits' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Commit History</h2>
              {commits.length === 0 ? (
                <p className="text-[#8b949e]">No commits yet. Make your first commit!</p>
              ) : (
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div
                      key={commit.commitId}
                      className="p-4 bg-[#0d1117] rounded border border-[#30363d]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg mb-1">{commit.message}</p>
                          <p className="text-sm text-[#8b949e] mb-2">
                            {commit.author?.username || 'Unknown'} •{' '}
                            {new Date(commit.date).toLocaleString()}
                          </p>
                          <p className="text-xs text-[#8b949e]">
                            Commit ID: {commit.commitId.substring(0, 8)}... •{' '}
                            {commit.filesCount} file(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add File to Staging</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Filename</label>
                  <input
                    type="text"
                    value={newFile.filename}
                    onChange={(e) => setNewFile({ ...newFile, filename: e.target.value })}
                    placeholder="example.js"
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newFile.content}
                    onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                    placeholder="Enter file content..."
                    rows={10}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 focus:outline-none focus:border-[#1f6feb] font-mono text-sm"
                  />
                </div>
                <button
                  onClick={handleAddFile}
                  className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md flex items-center gap-2"
                >
                  <FaPlus /> Add to Staging
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CLI Connection Instructions */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Connect Your Local Project</h2>
          <p className="text-[#8b949e] mb-4">
            Use DevTrack CLI in your project directory (just like Git!):
          </p>
          
          <div className="space-y-3 mb-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
              <div className="text-[#8b949e] mb-2"># 1. Login to CLI</div>
              <code className="text-[#58a6ff]">node index.js login</code>
            </div>
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
              <div className="text-[#8b949e] mb-2"># 2. Navigate to your project</div>
              <code className="text-[#58a6ff]">cd /path/to/your/project</code>
            </div>
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
              <div className="text-[#8b949e] mb-2"># 3. Initialize repository</div>
              <code className="text-[#58a6ff]">node index.js init</code>
            </div>
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
              <div className="text-[#8b949e] mb-2"># 4. Connect to this repository</div>
              <div className="flex items-center gap-2">
                <code className="text-[#58a6ff]">node index.js remote add {repo?._id}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`node index.js remote add ${repo?._id}`);
                    toast.success('Command copied to clipboard!');
                  }}
                  className="px-2 py-1 bg-[#238636] hover:bg-[#2ea043] rounded text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 font-mono text-sm">
              <div className="text-[#8b949e] mb-2"># 5. Add files and commit</div>
              <code className="text-[#58a6ff]">node index.js add file1.js</code><br/>
              <code className="text-[#58a6ff]">node index.js commit "Initial commit"</code><br/>
              <code className="text-[#58a6ff]">node index.js push</code>
            </div>
          </div>
          
          <div className="bg-[#1c2128] border border-[#30363d] rounded-md p-3 mt-4">
            <p className="text-sm text-[#8b949e]">
              <strong className="text-[#e6edf3]">Repository ID:</strong> <code className="text-[#58a6ff]">{repo?._id}</code>
            </p>
            <p className="text-xs text-[#8b949e] mt-2">
              All CLI operations will sync with this dashboard automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;

