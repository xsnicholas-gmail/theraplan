export function TheraHeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <svg viewBox="0 0 420 320" role="img">
        <defs>
          <linearGradient id="mat" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#237a4b" /><stop offset="1" stopColor="#7ed891" /></linearGradient>
          <linearGradient id="skin" x1="0" x2="1"><stop stopColor="#f5bc85" /><stop offset="1" stopColor="#e8895f" /></linearGradient>
        </defs>
        <path d="M38 247c58-63 115-74 174-34s112 31 165-15v74H38z" fill="#e1f6e5" />
        <rect x="62" y="228" width="270" height="34" rx="17" fill="url(#mat)" />
        <circle cx="173" cy="88" r="25" fill="url(#skin)" />
        <path d="M166 115c25-12 49-4 64 21l27 45c8 13-10 25-19 13l-30-39-33 40-49-6 25-58c3-7 8-13 15-16z" fill="#132018" />
        <path d="M175 195l54 39c10 7 2 23-10 18l-78-32-48 22c-13 6-22-12-10-20l53-34z" fill="#237a4b" />
        <path d="M238 139l43-22c13-7 24 12 11 20l-45 27z" fill="url(#skin)" />
        <path d="M148 142l-52-22c-14-6-21 15-7 21l55 26z" fill="url(#skin)" />
        <rect x="286" y="58" width="88" height="96" rx="22" fill="#fff" stroke="#dfe8dd" />
        <path d="M308 92h44M308 113h34" stroke="#237a4b" strokeWidth="10" strokeLinecap="round" />
        <circle cx="309" cy="133" r="10" fill="#ffcb65" />
      </svg>
      <div className="floating-card card-one"><span>3×12</span><small>target reps</small></div>
      <div className="floating-card card-two"><span>92%</span><small>weekly progress</small></div>
    </div>
  );
}
