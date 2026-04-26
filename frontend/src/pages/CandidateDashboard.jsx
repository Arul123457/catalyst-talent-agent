import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Settings,
  TrendingUp,
  Briefcase,
  Clock,
  DollarSign,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Input, { Textarea } from '../components/Input';
import Skeleton, { SkeletonCard } from '../components/Skeleton';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const response = await API.put('/api/candidate/profile', editData);
      setProfile(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <Skeleton variant="title" width="300px" className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <SkeletonCard />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-400">Track your profile and applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Briefcase}
              label="Applications"
              value={applications.length}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Match Score"
              value={applications.length > 0 
                ? `${(applications.reduce((acc, app) => acc + (app.match_score || 0), 0) / applications.length).toFixed(1)}%`
                : 'N/A'}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Notice Period"
              value={profile?.notice_period?.replace('_', ' ') || 'N/A'}
              color="yellow"
            />
            <StatCard
              icon={DollarSign}
              label="Expected Salary"
              value={profile?.expected_salary_lpa ? `${profile.expected_salary_lpa} LPA` : 'N/A'}
              color="purple"
            />
          </div>

          {/* Profile Card */}
          <Card className="p-6 lg:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">Your Profile</h2>
              {!editMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Save}
                    onClick={handleSaveProfile}
                    loading={saving}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {!editMode ? (
              <ProfileView profile={profile} />
            ) : (
              <ProfileEdit editData={editData} handleChange={handleEditChange} />
            )}
          </Card>

          {/* Applications Section */}
          <Card className="p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">My Applications</h2>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No applications yet</p>
                <p className="text-gray-500 text-sm">
                  Wait for recruiters to discover you through AI matching
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Match</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Interest</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Combined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                        <td className="py-4 px-4 text-white font-medium">{app.role}</td>
                        <td className="py-4 px-4 text-gray-300">{app.company}</td>
                        <td className="py-4 px-4">
                          <span className="text-green-400 font-semibold">
                            {app.match_score?.toFixed(1) || 'N/A'}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-blue-400 font-semibold">
                            {app.interest_score?.toFixed(1) || 'N/A'}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-purple-400 font-bold">
                            {app.combined_score?.toFixed(1) || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="warning" size="sm">
                            {app.status || 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: User, label: 'Profile', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <aside className="hidden lg:block w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Avatar name="User" size="lg" />
          <div>
            <div className="font-semibold text-white">Candidate</div>
            <div className="text-sm text-gray-400">Dashboard</div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-green-500/10 text-green-400 border-l-3 border-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    purple: 'bg-purple-500/10 text-purple-400'
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </Card>
  );
}

// Profile View Component
function ProfileView({ profile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileField label="Email" value={profile?.email} />
      <ProfileField label="Current Role" value={profile?.current_role} />
      <ProfileField label="Experience" value={`${profile?.experience_years} years`} />
      <ProfileField label="Domain" value={profile?.domain}>
        <Badge variant="info" size="sm">{profile?.domain}</Badge>
      </ProfileField>
      <ProfileField label="Location" value={profile?.location} />
      <ProfileField label="Education" value={profile?.education} />
      <ProfileField label="Notice Period" value={profile?.notice_period?.replace('_', ' ')} />
      <ProfileField label="Expected Salary" value={`${profile?.expected_salary_lpa} LPA`} />
      <div className="md:col-span-2">
        <ProfileField label="Skills">
          <div className="flex flex-wrap gap-2 mt-2">
            {profile?.skills?.map((skill, idx) => (
              <Badge key={idx} variant="success" size="sm">{skill}</Badge>
            ))}
          </div>
        </ProfileField>
      </div>
      <div className="md:col-span-2">
        <ProfileField label="Summary" value={profile?.summary} />
      </div>
    </div>
  );
}

function ProfileField({ label, value, children }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-400 mb-1">{label}</div>
      {children || <div className="text-white">{value}</div>}
    </div>
  );
}

// Profile Edit Component
function ProfileEdit({ editData, handleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        label="Current Role"
        name="current_role"
        value={editData.current_role || ''}
        onChange={handleChange}
      />
      <Input
        label="Experience Years"
        type="number"
        name="experience_years"
        value={editData.experience_years || ''}
        onChange={handleChange}
      />
      <Input
        label="Location"
        name="location"
        value={editData.location || ''}
        onChange={handleChange}
      />
      <Input
        label="Expected Salary (LPA)"
        type="number"
        name="expected_salary_lpa"
        value={editData.expected_salary_lpa || ''}
        onChange={handleChange}
        step="0.1"
      />
      <div className="md:col-span-2">
        <Input
          label="Skills (comma separated)"
          name="skills"
          value={editData.skills?.join(', ') || ''}
          onChange={handleChange}
        />
      </div>
      <div className="md:col-span-2">
        <Textarea
          label="Summary"
          name="summary"
          value={editData.summary || ''}
          onChange={handleChange}
          rows={4}
        />
      </div>
    </div>
  );
}

export default CandidateDashboard;
