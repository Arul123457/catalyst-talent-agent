import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Target,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  PlayCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Quote
} from 'lucide-react';
import Reveal from '../components/Reveal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Footer from '../components/Footer';

function Landing() {
  return (
    <div className="bg-gray-950 text-white">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Animated Badge */}
          <Reveal delay={0}>
            <div className="inline-flex items-center mb-8">
              <Badge variant="success" dot size="md" className="text-sm">
                AI-Powered Talent Intelligence
              </Badge>
            </div>
          </Reveal>

          {/* Main Headline */}
          <Reveal delay={100}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-tight mb-6">
              <span className="block text-white">Scout Smarter.</span>
              <span className="block text-gradient">Hire Faster.</span>
            </h1>
          </Reveal>

          {/* Subheadline */}
          <Reveal delay={200}>
            <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              From job description to ranked shortlist in minutes. AI-powered semantic matching, 
              conversational engagement, and intelligent scoring.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/scout">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="group"
                >
                  <span>Start Scouting Free</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                icon={PlayCircle}
              >
                Watch Demo
              </Button>
            </div>
          </Reveal>

          {/* Social Proof */}
          <Reveal delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex -space-x-2">
                <Avatar name="Alex Johnson" size="sm" />
                <Avatar name="Sarah Chen" size="sm" />
                <Avatar name="Mike Davis" size="sm" />
                <Avatar name="Emma Wilson" size="sm" />
                <Avatar name="John Smith" size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span>Trusted by 500+ recruiters</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Floating Dashboard Mockup */}
          <Reveal delay={500}>
            <div className="mt-20 relative">
              <FloatingDashboardMockup />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Floating Dashboard Mockup Component
function FloatingDashboardMockup() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Card */}
      <div className="relative animate-float">
        <Card className="p-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <Avatar name="Sarah Chen" size="lg" />
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Sarah Chen</h3>
              <p className="text-sm text-gray-400 mb-3">Senior Full-Stack Engineer</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="success" size="sm">React</Badge>
                <Badge variant="success" size="sm">Node.js</Badge>
                <Badge variant="success" size="sm">AWS</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }} />
                </div>
                <Badge variant="success" size="sm" dot>
                  AI Match: 97%
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Card */}
      <div className="absolute -right-4 top-12 w-64 animate-float" style={{ animationDelay: '1s' }}>
        <Card className="p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">New Matches</span>
            <Badge variant="primary" size="sm">3</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar name="Mike Davis" size="sm" />
              <span className="text-xs text-gray-400">Mike Davis</span>
              <span className="text-xs text-green-400 ml-auto">94%</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar name="Emma Wilson" size="sm" />
              <span className="text-xs text-gray-400">Emma Wilson</span>
              <span className="text-xs text-green-400 ml-auto">91%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════════════════════════════════
function StatsBar() {
  return (
    <Reveal>
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatItem end={10000} suffix="+" label="Candidates Indexed" />
            <StatItem end={97} suffix="%" label="Match Accuracy" />
            <StatItem end={3} suffix="x" label="Faster Hiring" />
            <StatItem end={500} suffix="+" label="Companies" />
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function StatItem({ end, suffix, label }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ═══════════════════════════════════════════════════════════════════════════
function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'JD Intelligence',
      description: 'Automatically extract key requirements, skills, and culture signals from any job description using advanced NLP.',
      span: 'lg:col-span-2'
    },
    {
      icon: Target,
      title: 'Semantic Matching',
      description: 'Vector-based search finds candidates beyond keyword matching using 384-dimensional embeddings.',
      span: 'lg:col-span-1'
    },
    {
      icon: MessageSquare,
      title: 'AI Engagement',
      description: 'Multi-turn conversations assess cultural fit, enthusiasm, and genuine interest automatically.',
      span: 'lg:col-span-1'
    },
    {
      icon: TrendingUp,
      title: 'Smart Ranking',
      description: 'Weighted scoring combines technical match with engagement quality for actionable insights.',
      span: 'lg:col-span-2'
    },
    {
      icon: Sparkles,
      title: 'Instant Narratives',
      description: 'AI-generated candidate summaries provide context for every shortlisted profile.',
      span: 'lg:col-span-1'
    }
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">Why ScoutAI</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Everything you need to</span>
              <br />
              <span className="text-gradient">find perfect candidates</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Reveal key={index} delay={index * 100}>
              <Card
                hover
                className={`p-8 ${feature.span} group relative overflow-hidden`}
              >
                {/* Decorative Grid Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '8px 8px'
                  }} />
                </div>

                <div className="relative">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS SECTION
// ═══════════════════════════════════════════════════════════════════════════
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Connect your ATS or upload CSV',
      description: 'Import candidate data from your existing systems or upload a simple CSV file.'
    },
    {
      number: '02',
      title: 'AI analyzes & ranks candidates',
      description: 'Our semantic engine matches candidates to your job requirements using vector embeddings.'
    },
    {
      number: '03',
      title: 'Engage top talent instantly',
      description: 'AI conducts natural conversations to assess interest and cultural fit automatically.'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-20">
            How It Works
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          {steps.map((step, index) => (
            <Reveal key={index} delay={index * 150}>
              <div className="relative">
                {/* Step Number Background */}
                <div className="absolute -top-4 -left-4 text-8xl font-bold text-gray-800/20 select-none">
                  {step.number}
                </div>

                <div className="relative bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 mb-6">
                    <span className="text-2xl font-bold text-green-400">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION
// ═══════════════════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Catalyst reduced our time-to-hire by 60%. The AI engagement feature is a game-changer for understanding candidate interest before the first call.",
      name: "Sarah Johnson",
      role: "Head of Talent @ TechCorp"
    },
    {
      quote: "The semantic matching is incredibly accurate. We're finding candidates we would have missed with traditional keyword search.",
      name: "Michael Chen",
      role: "Recruiting Lead @ StartupXYZ"
    },
    {
      quote: "Finally, a tool that combines the power of AI with the nuance of human conversation. Our shortlists are now actually actionable.",
      name: "Emily Rodriguez",
      role: "VP People @ GrowthCo"
    }
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-20">
            Loved by recruiters
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={index} delay={index * 100}>
              <Card hover className="p-8 group">
                <Quote className="w-10 h-10 text-green-400/30 mb-6" />
                <p className="text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar name={testimonial.name} size="md" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════
function FinalCTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to scout smarter?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join hundreds of recruiters who are finding better candidates faster with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={Zap}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Landing;
