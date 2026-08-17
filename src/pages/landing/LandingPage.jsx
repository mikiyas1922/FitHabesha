import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell,
  Star,
  ArrowRight,
  Check,
  Target,
  UserCheck,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Flame,
  Trophy,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Memberships', href: '#pricing' },
  { label: 'Coaches', href: '#coaches' },
  { label: 'Testimonials', href: '#testimonials' },
]

const footerLinks = {
  platform: [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Plans', href: '#pricing' },
    { label: 'Trainers', href: '#coaches' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Press', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Support', href: '#contact' },
    { label: 'Contact', href: '#contact' },
  ],
}

const featuresRow1 = [
  {
    icon: Dumbbell,
    title: 'Personalized Workouts',
    description: 'AI-driven workout plans tailored to your fitness goals and progress.',
  },
  {
    icon: Target,
    title: 'Smart Meal Plans',
    description: 'Nutrition mapping with macro tracking and dietary preference support.',
  },
  {
    icon: UserCheck,
    title: 'Real-time Check-in',
    description: 'Seamless gym entry with QR code scanning and instant verification.',
  },
]

const featuresRow2 = [
  {
    icon: Star,
    title: 'Trainer Ratings',
    description: 'Rate and review trainers based on your session experience.',
    wide: false,
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your fitness journey with comprehensive analytics.',
    wide: false,
  },
]

const steps = [
  {
    number: '01',
    title: 'Sign Up & Set Goals',
    description: 'Create your profile and define your fitness objectives in minutes.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    highlight: false,
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'Connect with expert trainers tailored to your specific goals.',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    highlight: true,
  },
  {
    number: '03',
    title: 'Track Transformation',
    description: 'Monitor progress with real-time analytics and milestone tracking.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    highlight: false,
  },
]

const plans = [
  {
    name: 'Basic',
    price: '$29',
    period: '/month',
    features: ['Gym floor access', 'Basic workout tracking', 'Mobile app', 'Locker room'],
  },
  {
    name: 'Premium',
    price: '$59',
    period: '/month',
    popular: true,
    badge: 'BEST VALUE',
    features: ['All Basic features', '4 trainer sessions/month', 'Nutrition planning', 'Class priority', 'Progress analytics'],
  },
  {
    name: 'VIP Elite',
    price: '$99',
    period: '/month',
    features: ['All Premium features', 'Unlimited sessions', 'Custom meal plans', '24/7 support', 'Spa access'],
  },
]

const testimonials = [
  {
    name: 'Sara Bekele',
    role: 'Member · 2 years',
    text: 'Fit Habesha completely transformed my approach to fitness. The personalized workouts helped me lose 30 pounds.',
    rating: 5,
    highlight: false,
  },
  {
    name: 'Daniel Tesfaye',
    role: 'Member · 1 year',
    text: 'The trainer matching system is incredible. I found the perfect coach who keeps me motivated every session.',
    rating: 5,
    highlight: true,
  },
  {
    name: 'Hanna Girma',
    role: 'Member · 6 months',
    text: 'From booking to progress tracking, everything is seamless. I\'ve never felt more supported in my journey.',
    rating: 5,
    highlight: false,
  },
]

const coaches = [
  {
    name: 'Marcus Vance',
    specialty: 'Strength & Conditioning',
    rating: '4.9',
    price: '$45/session',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Sarah Darling',
    specialty: 'Yoga & Flexibility',
    rating: '4.8',
    price: '$40/session',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Devon Carter',
    specialty: 'HIIT & Cardio',
    rating: '5.0',
    price: '$50/session',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop',
  },
]

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex size-8 items-center justify-center rounded-md bg-primary">
        <Dumbbell className="size-4 text-dark" />
      </div>
      <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">
        Fit<span className="text-primary">Habesha</span>
      </span>
    </div>
  )
}

function HeroDashboard() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-dark-card p-5 shadow-2xl">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-[#1a1a1a] border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="size-4 text-primary" />
            <span className="text-xs text-muted uppercase tracking-wide">Calories</span>
          </div>
          <p className="text-2xl font-bold text-white">3,420</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="size-4 text-primary" />
            <span className="text-xs text-muted uppercase tracking-wide">Protein</span>
          </div>
          <p className="text-2xl font-bold text-white">5.2<span className="text-sm text-muted">g</span></p>
        </div>
      </div>
      <div className="rounded-xl bg-primary p-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-dark/20">
          <Trophy className="size-5 text-dark" />
        </div>
        <div>
          <p className="text-sm font-bold text-dark">Goal Achieved!</p>
          <p className="text-xs text-dark/70">Weekly workout target completed</p>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-1 h-16">
        {[35, 55, 40, 70, 50, 85, 60, 75, 45, 90, 65, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, highlight = false, className = '' }) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col ${
        highlight
          ? 'bg-primary border-primary text-dark'
          : 'bg-dark-card border-white/10 text-white hover:border-primary/30'
      } transition-colors ${className}`}
    >
      <div
        className={`flex size-11 items-center justify-center rounded-xl mb-4 ${
          highlight ? 'bg-dark/15 text-dark' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon className="size-5" />
      </div>
      <h3 className={`text-base font-bold mb-2 ${highlight ? 'text-dark' : 'text-white'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed flex-1 ${highlight ? 'text-dark/70' : 'text-muted'}`}>
        {description}
      </p>
      <a
        href="#"
        className={`mt-4 text-sm font-semibold inline-flex items-center gap-1 ${
          highlight ? 'text-dark hover:text-dark/70' : 'text-primary hover:text-primary-light'
        }`}
      >
        Learn More <ArrowRight className="size-3.5" />
      </a>
    </div>
  )
}

function SocialIcon({ children, label, href }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-white/10 text-muted hover:border-primary/30 hover:text-primary transition-colors"
    >
      {children}
    </a>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/"><Logo /></Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm text-muted hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button size="sm" className="text-dark font-bold px-5">Get Started</Button>
            </Link>
            <button
              type="button"
              className="lg:hidden flex size-9 items-center justify-center rounded-lg border border-white/10 text-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm text-muted py-1" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1"><Button variant="ghost" className="w-full text-muted">Sign In</Button></Link>
              <Link to="/register" className="flex-1"><Button className="w-full text-dark font-bold">Get Started</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative" style={{ paddingTop: '180px', paddingBottom: '96px', paddingLeft: '80px', paddingRight: '80px', gap: '64px', background: 'linear-gradient(0deg, #0B1224, #0B1224), radial-gradient(100% 80% at 50% 20%, rgba(0, 242, 153, 0.0823529) 0%, rgba(0, 0, 0, 0) 80%)' }}>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] uppercase text-white">
                Be Strong.
                <br />
                Be <span className="text-primary">Ethiopian.</span>
              </h1>
              <p className="mt-6 max-w-lg text-muted leading-relaxed">
                Engineered for Ethiopian athletes. Transform your fitness journey with cutting-edge
                technology, personalized training, and a community dedicated to your success.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="text-dark font-bold px-8">Start Now</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="border-primary/40 text-white bg-transparent hover:bg-primary/10 px-8">
                    View Plans
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-8">
                {[
                  { value: '1,200+', label: 'Active Members' },
                  { value: '4.9', label: 'Average Rating' },
                  { value: '24', label: 'Expert Trainers' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="border-y border-white/10 bg-dark-card/60">
        <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1,200+', label: 'Active Members' },
            { value: '24', label: 'Expert Trainers' },
            { value: '4.9 / 5', label: 'Average Rating' },
            { value: '98%', label: 'Retention Rate' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', gap: '64px', backgroundColor: '#060A16' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 mb-12 items-end">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
              Engineered For
              <br />
              <span className="text-primary">Peak Performance</span>
            </h2>
            <p className="text-muted leading-relaxed lg:pb-1">
              Powerful tools designed to elevate every aspect of your fitness experience — from
              personalized workouts to real-time progress tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {featuresRow1.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Calendar}
              title="Class Booking & Scheduling"
              description="Book group fitness classes instantly with real-time availability and smart scheduling."
              highlight
              className="md:col-span-1 lg:col-span-1"
            />
            {featuresRow2.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', gap: '80px', backgroundColor: '#0B1224' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Three Steps to Peak Performance</h2>
            <p className="mt-3 text-muted">Get started in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="group">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4">
                  <img src={step.image} alt={step.title} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-6xl font-black text-white/20">{step.number}</span>
                </div>
                <div className={`rounded-xl p-5 ${step.highlight ? 'bg-primary' : 'bg-dark-card border border-white/10'}`}>
                  <h3 className={`font-bold text-lg mb-1 ${step.highlight ? 'text-dark' : 'text-white'}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${step.highlight ? 'text-dark/70' : 'text-muted'}`}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', gap: '80px', backgroundColor: '#060A16' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Invest In Your Performance</h2>
            <p className="mt-3 text-muted">Choose the plan that fits your fitness goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'bg-primary text-dark ring-2 ring-primary md:scale-105'
                    : 'bg-dark-card border border-white/10'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-dark px-3 py-1 text-xs font-bold text-primary uppercase tracking-wide">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-lg font-bold ${plan.popular ? 'text-dark' : 'text-white'}`}>{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.popular ? 'text-dark' : 'text-white'}`}>{plan.price}</span>
                  <span className={plan.popular ? 'text-dark/60' : 'text-muted'}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-dark/80' : 'text-muted'}`}>
                      <Check className={`size-4 shrink-0 ${plan.popular ? 'text-dark' : 'text-primary'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    className={`w-full font-bold ${plan.popular ? 'bg-dark text-white hover:bg-dark/90' : 'text-dark'}`}
                    variant={plan.popular ? 'dark' : 'primary'}
                  >
                    Select Plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', gap: '80px', backgroundColor: '#0B1224' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">What Our Athletes Say</h2>
            <p className="mt-3 text-muted">Real stories from real members who transformed their lives.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className={`rounded-2xl p-6 ${
                  item.highlight
                    ? 'bg-primary text-dark'
                    : 'bg-dark-card border border-white/10'
                }`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className={`size-4 fill-current ${item.highlight ? 'text-dark' : 'text-primary'}`} />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-5 ${item.highlight ? 'text-dark/80' : 'text-muted'}`}>
                  &ldquo;{item.text}&rdquo;
                </p>
                <div>
                  <p className={`font-bold ${item.highlight ? 'text-dark' : 'text-white'}`}>{item.name}</p>
                  <p className={`text-sm ${item.highlight ? 'text-dark/60' : 'text-muted'}`}>{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', gap: '80px', backgroundColor: '#060A16' }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Match With Premium Trainers</h2>
            <p className="mt-3 text-muted">Connect with expert coaches tailored to your specific goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div key={coach.name} className="rounded-2xl overflow-hidden border border-white/10 bg-dark-card group hover:border-primary/30 transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">{coach.name}</h3>
                      <p className="text-sm text-primary mt-0.5">{coach.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{coach.rating}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-muted">{coach.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '80px', paddingRight: '80px', gap: '32px', borderTop: '1px solid #1F2E45', borderBottom: '1px solid #1F2E45', background: 'linear-gradient(0deg, #121B2E, #121B2E), linear-gradient(135deg, rgba(0, 242, 153, 0.0627451) 25%, rgba(0, 0, 0, 0) 75%)' }}>
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-primary px-8 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              Start Your Transformation Today
            </h2>
            <p className="text-dark/70 max-w-lg mx-auto mb-8">
              Join thousands of members who have already achieved their fitness goals with Fit Habesha.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="dark" className="px-10 font-bold">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  className="px-10 font-bold bg-transparent border-2 border-dark text-dark hover:bg-dark/10"
                >
                  Talk to a Coach
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" style={{ paddingTop: '80px', paddingBottom: '40px', paddingLeft: '80px', paddingRight: '80px', gap: '64px', backgroundColor: '#0A1128' }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-muted leading-relaxed">
                Ethiopia&apos;s premier fitness platform. Built for athletes who demand peak performance.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted hover:text-primary transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Company</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted hover:text-primary transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div id="contact">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted hover:text-primary transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
            <p className="text-sm text-muted">© 2024 FitHabesha Inc. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <SocialIcon label="X / Twitter" href="#">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon label="Instagram" href="#">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn" href="#">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
