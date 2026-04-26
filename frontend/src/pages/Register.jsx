import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input, { Textarea, Select } from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    current_role: '',
    experience_years: '',
    skills: '',
    domain: 'saas',
    location: '',
    education: '',
    notice_period: '30_days',
    expected_salary_lpa: '',
    summary: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Convert skills string to array
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    
    const payload = {
      ...formData,
      skills: skillsArray,
      experience_years: parseInt(formData.experience_years),
      expected_salary_lpa: parseFloat(formData.expected_salary_lpa)
    };

    const result = await register(payload);
    
    if (result.success) {
      navigate('/candidate/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Value Props */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        {/* Large Icon Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <UserPlus className="w-96 h-96 text-green-400" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/" className="flex items-center space-x-2 mb-12">
            <Zap className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">Catalyst</span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-8">
            Join the talent pool of tomorrow
          </h2>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Get discovered by top companies using AI matching</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Showcase your skills with intelligent profile analysis</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Track your applications and match scores in real-time</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Free forever for candidates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Logo for Mobile */}
          <Link to="/" className="flex lg:hidden items-center justify-center space-x-2 mb-8">
            <Zap className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-white">Catalyst</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your candidate profile</h1>
            <p className="text-gray-400">Join the future of talent discovery</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              helperText="Minimum 8 characters"
              required
            />

            {/* Professional Information */}
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Current Role"
                    type="text"
                    name="current_role"
                    value={formData.current_role}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>

                <Input
                  label="Skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, AWS"
                  helperText="Comma-separated list of your key skills"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                  >
                    <option value="fintech">Fintech</option>
                    <option value="healthtech">Healthtech</option>
                    <option value="edtech">Edtech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="devtools">DevTools</option>
                  </Select>

                  <Input
                    label="Location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Bangalore, India"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Education"
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="B.Tech in Computer Science"
                    required
                  />

                  <Select
                    label="Notice Period"
                    name="notice_period"
                    value={formData.notice_period}
                    onChange={handleChange}
                    required
                  >
                    <option value="immediate">Immediate</option>
                    <option value="30_days">30 Days</option>
                    <option value="60_days">60 Days</option>
                    <option value="90_days">90 Days</option>
                  </Select>
                </div>

                <Input
                  label="Expected Salary (LPA)"
                  type="number"
                  name="expected_salary_lpa"
                  value={formData.expected_salary_lpa}
                  onChange={handleChange}
                  placeholder="25.5"
                  min="0"
                  step="0.1"
                  helperText="Annual salary expectation in Lakhs"
                  required
                />

                <Textarea
                  label="Profile Summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief summary of your experience, expertise, and what you're looking for..."
                  helperText="Help recruiters understand your background and career goals"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
