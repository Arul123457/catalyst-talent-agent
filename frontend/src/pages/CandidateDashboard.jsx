import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchApplications();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/api/candidate/profile');
      setProfile(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await API.get('/api/candidate/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setEditData({ ...editData, [name]: value.split(',').map(s => s.trim()) });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await API.put('/api/candidate/profile', editData);
      setProfile(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Welcome, {profile?.name}!
        </h1>
        
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Profile</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData(profile);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{profile?.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Role</p>
                <p className="text-white">{profile?.current_role}</p>
              </div>
              <div>
                <p className="text-gray-400">Experience</p>
                <p className="text-white">{profile?.experience_years} years</p>
              </div>
              <div>
                <p className="text-gray-400">Domain</p>
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {profile?.domain}
                </span>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white">{profile?.location}</p>
              </div>
              <div>
                <p className="text-gray-400">Education</p>
                <p className="text-white">{profile?.education}</p>
              </div>
              <div>
                <p className="text-gray-400">Notice Period</p>
                <p className="text-white">{profile?.notice_period?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-400">Expected Salary</p>
                <p className="text-white">{profile?.expected_salary_lpa} LPA</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">Summary</p>
                <p className="text-white">{profile?.summary}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Current Role</label>
                <input
                  type="text"
                  name="current_role"
                  value={editData.current_role || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Experience Years</label>
                <input
                  type="number"
                  name="experience_years"
                  value={editData.experience_years || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData.location || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Expected Salary (LPA)</label>
                <input
                  type="number"
                  name="expected_salary_lpa"
                  value={editData.expected_salary_lpa || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={editData.skills?.join(', ') || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Summary</label>
                <textarea
                  name="summary"
                  value={editData.summary || ''}
                  onChange={handleEditChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Applications Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">My Applications</h2>
          
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No applications yet — wait for recruiters to discover you
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-gray-300">Role Applied</th>
                    <th className="pb-3 text-gray-300">Company</th>
                    <th className="pb-3 text-gray-300">Match Score</th>
                    <th className="pb-3 text-gray-300">Interest Score</th>
                    <th className="pb-3 text-gray-300">Combined</th>
                    <th className="pb-3 text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-700">
                      <td className="py-3 text-white">{app.role}</td>
                      <td className="py-3 text-gray-300">{app.company}</td>
                      <td className="py-3 text-white">{app.match_score?.toFixed(1) || 'N/A'}</td>
                      <td className="py-3 text-white">{app.interest_score?.toFixed(1) || 'N/A'}</td>
                      <td className="py-3 text-white font-semibold">{app.combined_score?.toFixed(1) || 'N/A'}</td>
                      <td className="py-3">
                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
