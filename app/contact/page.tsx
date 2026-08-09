'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, MessageSquare, Instagram, Twitter, Linkedin } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@aureliafragrance.com',
    action: 'mailto:hello@aureliafragrance.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    action: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    label: 'Atelier',
    value: 'San Francisco, CA',
    action: '#',
  },
];

const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
  { day: 'Sunday', hours: 'By appointment only' },
];

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#', accent: 'hover:text-pink-400' },
  { name: 'Twitter', icon: Twitter, href: '#', accent: 'hover:text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', accent: 'hover:text-blue-600' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('sent');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink via-ink to-black text-ink dark:text-white">
      <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(183,147,78,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(183,147,78,0.1),transparent_35%)]" />
        <div className="mx-auto max-w-8xl">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div>
                <p className="eyebrow">We are listening</p>
                <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl md:text-7xl dark:text-white">Let's talk fragrance.</h1>
                <p className="mt-6 max-w-xl text-base leading-8 dark:text-white">
                  Whether you need help selecting a scent, have a question about an order, or simply want to share your fragrance story, our concierge team is here to guide you through every moment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.label}
                      href={method.action}
                      className="luxury-panel group min-w-0 w-full rounded-2xl p-4 transition hover:border-gold/50 hover:bg-gold/5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold group-hover:bg-gold/20">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{method.label}</p>
                          <p className="mt-1 max-w-full break-words text-sm font-semibold text-ink dark:text-white">{method.value}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#070604]/90 p-4 shadow-xl shadow-black/20">
              <div className="absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_top_right,rgba(183,147,78,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(20,18,15,0.12),transparent_25%)] blur-3xl" />
              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-[2rem] bg-white/5">
                  <img
                    src="https://vanesastore.com/cdn/shop/files/SHU01287copy.png?v=1715855842"
                    alt="luxury perfume bottle"
                    className="h-80 w-full object-cover sm:h-[420px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-black dark:text-white">
                    <p className="eyebrow text-gold/90">Signature scent</p>
                    <h3 className="mt-2 font-serif text-2xl">Velvet elegance</h3>
                    <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">A refined bottle inspired by quiet luxury and luminous nights.</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="relative overflow-hidden rounded-[1.75rem] h-44 bg-white/5">
                    <img src="https://hips.hearstapps.com/hmg-prod/images/img-2857-jpg-6920aa2de3c98.jpg?crop=1.00xw:0.939xh;0,0.0612xh" alt="perfume bottle on marble" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-black dark:text-white">
                      <p className="text-xs uppercase tracking-[.22em] text-gold">Iconic bottle</p>
                      <p className="mt-1 text-sm">Bright and poised with a glassy shimmer.</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.75rem] h-44 bg-white/5">
                    <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85" alt="perfume bottle with cedar" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-black dark:text-white">
                      <p className="text-xs uppercase tracking-[.22em] text-gold">Woodland allure</p>
                      <p className="mt-1 text-sm">Deep cedar and honeyed amber for evening rituals.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-8xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div className="luxury-panel rounded-3xl p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
                  <Clock size={22} />
                </span>
                <div>
                  <p className="eyebrow">Atelier hours</p>
                  <h3 className="mt-2 font-serif text-2xl text-black dark:text-white">Always available</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {businessHours.map((item) => (
                  <div key={item.day} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-black dark:text-white">{item.day}</span>
                    <span className="text-sm font-semibold text-gold">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Quick response</p>
                <p className="mt-2 text-sm leading-6 text-black dark:text-white">Expect a reply within 2 hours during business hours, or first thing next morning.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="luxury-panel space-y-5 rounded-3xl p-8 text-ink dark:text-white">
              <div>
                <p className="eyebrow">Send us a message</p>
                <h3 className="mt-3 font-serif text-2xl text-black dark:text-white">Let's start a conversation</h3>
                <p className="mt-3 text-sm leading-6 text-black dark:text-white/80">Tell us about your fragrance needs, questions, or feedback. We read and respond to every message.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="luxury-label" htmlFor="contact-name">
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="luxury-input mt-2"
                  />
                </div>

                <div>
                  <label className="luxury-label" htmlFor="contact-email">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="luxury-input mt-2"
                  />
                </div>

                <div>
                  <label className="luxury-label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="luxury-input mt-2"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order & Shipping</option>
                    <option value="recommendation">Fragrance Recommendation</option>
                    <option value="gifting">Gifting & Concierge</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="luxury-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="luxury-input mt-2 resize-none"
                  />
                </div>

                {status === 'sent' && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2">
                    <Sparkles size={16} />
                    Thanks for reaching out. We will be in touch shortly.
                  </div>
                )}

                {status === 'error' && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    Please complete all fields before sending.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="button-gold w-full gap-2 py-4 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                  {status !== 'sending' && <Send size={15} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-8xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="luxury-panel rounded-3xl p-8 text-ink dark:text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
                  <Mail size={22} />
                </span>
                <div>
                  <p className="eyebrow">The Private List</p>
                  <h3 className="mt-2 font-serif text-2xl">Stay in the loop</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-black dark:text-stone-300">
                New arrivals, intimate stories, seasonal edits, and exclusive offers delivered to your inbox.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="luxury-input flex-1 min-w-0"
                />
                <button className="button-gold px-6">Join</button>
              </div>
            </div>

            <div className="luxury-panel rounded-3xl p-8 text-ink dark:text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
                  <MessageSquare size={22} />
                </span>
                <div>
                  <p className="eyebrow">Connect with us</p>
                  <h3 className="mt-2 font-serif text-2xl">Follow our story</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-black dark:text-stone-300">
                Behind-the-scenes moments, customer stories, and fragrance inspiration shared daily.
              </p>
              <div className="mt-6 flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`rounded-full border border-white/10 p-3 text-black transition hover:border-gold/50 ${link.accent}`}
                      title={link.name}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-8xl">
          <div>
            <p className="eyebrow">Common questions</p>
            <h2 className="mt-3 font-serif text-4xl">Frequently asked</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                q: 'How long does delivery take?',
                a: 'Complimentary shipping arrives within 3-5 business days. Express options available at checkout.',
              },
              {
                q: 'Can I request a sample?',
                a: 'Yes! Contact our concierge with specific fragrances and we will send you samples to explore.',
              },
              {
                q: 'What if I want personalized help?',
                a: 'Book a private consultation via email. We offer 1:1 guidance for gifting and signature discovery.',
              },
              {
                q: 'Do you offer gift wrapping?',
                a: 'Luxury gift wrapping is included with every order. Custom messages available upon request.',
              },
            ].map((item, idx) => (
              <div key={idx} className="luxury-panel rounded-2xl p-6">
                <h3 className="font-serif text-lg text-gold">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-black dark:text-stone-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
