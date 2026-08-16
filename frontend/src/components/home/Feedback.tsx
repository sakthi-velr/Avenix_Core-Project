import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import { type FeedbackReview, getReviews, submitReview } from '../../services/storage';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackReview[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [service, setService] = useState('Website Development');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const loadApprovedFeedbacks = () => {
    getReviews()
      .then(allReviews => {
        const approved = allReviews.filter(r => r.status === 'approved');
        setFeedbacks(approved);
      })
      .catch(err => console.error('Failed to load reviews:', err));
  };

  useEffect(() => {
    loadApprovedFeedbacks();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Spam bot caught
      setSubmitStatus('success');
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    submitReview({
      name: name.trim(),
      email: email.trim(),
      rating,
      service,
      message: message.trim()
    })
      .then(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        
        // Reset Form
        setName('');
        setEmail('');
        setRating(5);
        setMessage('');

        // Reload lists
        loadApprovedFeedbacks();
      })
      .catch((err) => {
        console.error('Submit review error:', err);
        setIsSubmitting(false);
        setSubmitStatus('error');
      });
  };

  return (
    <section id="feedback" className="relative pt-0 pb-16 bg-black overflow-hidden border-t border-brand-dark-green/10">
      {/* Background glow overlay */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 select-none">
          <div className="flex items-center justify-center gap-3 mb-4 animate-text animate-scale-fade stagger-1">
            <span className="h-[1px] w-8 bg-brand-green/50" />
            <span className="text-[11px] tracking-[0.25em] font-bold text-brand-green uppercase">
              FEEDBACK
            </span>
            <span className="h-[1px] w-8 bg-brand-green/50" />
          </div>
          <h2 className="font-display text-5xl sm:text-6xl tracking-tight text-white mb-4 uppercase animate-text animate-scale-fade stagger-2">
            YOUR FEEDBACK <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green">SHAPES OUR NEXT MOVE.</span>
          </h2>
          <p className="text-brand-textSecondary text-base sm:text-lg max-w-md mx-auto leading-relaxed animate-text animate-scale-fade stagger-3">
            Tell us what you think about your experience with Avenix Core.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-5 bg-brand-dark-2/40 border border-brand-green/10 p-8 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-body">
              <MessageSquare className="w-5 h-5 text-brand-green" /> Share Your Thoughts
            </h3>

            {submitStatus === 'success' ? (
              <div className="text-center py-8 space-y-4 select-none">
                <CheckCircle className="w-12 h-12 text-brand-green mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-white font-body">Feedback Submitted!</h4>
                <p className="text-brand-textSecondary text-sm leading-relaxed font-body">
                  Thank you. Your feedback has been received.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-2.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-bold tracking-wider hover:bg-brand-green/20 transition-all min-h-[44px]"
                >
                  SUBMIT ANOTHER FEEDBACK
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field (hidden from users, exposes spam bots) */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="feedback-name" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Name *
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px]"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="feedback-email" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Email *
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px]"
                  />
                </div>

                {/* Rating selection (1-5 stars) */}
                <div className="flex flex-col space-y-2 select-none">
                  <span className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Rating *
                  </span>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-brand-textMuted hover:text-brand-lime transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`Rate ${star} Stars`}
                      >
                        <Star
                          className={`w-6 h-6 stroke-[1.5] ${
                            star <= (hoverRating ?? rating)
                              ? 'fill-brand-lime text-brand-lime'
                              : 'text-brand-textMuted'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service selection */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="feedback-service" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Service Used
                  </label>
                  <select
                    id="feedback-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body min-h-[44px] cursor-pointer"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="Poster Making">Poster Making</option>
                    <option value="Web Invitation">Web Invitation</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="feedback-message" className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider font-body">
                    Feedback Message *
                  </label>
                  <textarea
                    id="feedback-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your experience with us..."
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 font-body"
                  />
                </div>

                {submitStatus === 'error' && (
                  <p className="text-sm font-semibold text-red-500 font-body">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green text-black font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(242,255,88,0.3)] transition-all duration-300 disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND FEEDBACK'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Dynamic Feedbacks Board */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-wide border-b border-brand-green/10 pb-4 font-body uppercase select-none">
              Recent Client Reviews ({feedbacks.length})
            </h3>
            
            {feedbacks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                {feedbacks.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-glow-card-wrapper group relative"
                    style={{ '--card-delay': `${idx * -1.8}s` } as React.CSSProperties}
                  >
                    {/* Glow Aura */}
                    <div className="rounded-glow-card-aura" />

                    {/* Card Body */}
                    <div
                      className="rounded-glow-card p-6 border border-brand-green/5 bg-brand-dark-2/20 hover:border-brand-green/20 rounded-2xl transition-all duration-300 h-full"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 select-none">
                        <div>
                          <h4 className="text-sm font-bold text-white font-body">{item.name}</h4>
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">
                            {item.service}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= item.rating
                                  ? 'fill-brand-lime text-brand-lime'
                                  : 'text-brand-textMuted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-brand-textSecondary text-sm leading-relaxed font-body">
                        "{item.message}"
                      </p>
                      <div className="mt-3 text-[10px] font-bold text-brand-textMuted tracking-wider uppercase select-none">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-brand-green/20 bg-brand-dark-2/10 rounded-2xl text-center select-none">
                <MessageSquare className="w-12 h-12 text-brand-green/45 mb-4" />
                <p className="text-white font-bold text-base uppercase tracking-wider mb-2 font-body">
                  No Reviews Yet
                </p>
                <p className="text-brand-textSecondary text-sm max-w-xs font-body">
                  Your feedback could appear here. Be the first to share your experience!
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
