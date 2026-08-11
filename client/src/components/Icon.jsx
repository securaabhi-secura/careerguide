// Minimal hand-rolled icon set to avoid an extra dependency.
// Each icon accepts className for sizing/color via currentColor.
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const Icon = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
  ),
  Explore: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
  ),
  Saved: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 19.2l8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z" /></svg>
  ),
  Chat: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M21 12a8 8 0 1 1-3.6-6.7" /><path d="M21 3v6h-6" transform="translate(-3,3)" /><path d="M4 20l1.5-4A8 8 0 1 1 12 20a7.9 7.9 0 0 1-4-1.1L4 20Z" /></svg>
  ),
  Profile: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M15 18l-6-6 6-6" /></svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 19.2l8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z" /></svg>
  ),
  HeartFilled: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 19.2l8.8-8.8c1.6-1.6 1.6-4.2 0-5.8Z" /></svg>
  ),
  Puzzle: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 9h4V6a2 2 0 1 1 4 0v3h4a2 2 0 0 1 2 2v4a2 2 0 1 1 0 4v-4h-4v4a2 2 0 1 1-4 0v-4H6a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4Z" /></svg>
  ),
  Palette: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><circle cx="8" cy="10" r="1.2" fill="currentColor" /><circle cx="12" cy="8" r="1.2" fill="currentColor" /><circle cx="16" cy="10" r="1.2" fill="currentColor" /></svg>
  ),
  BarChart: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></svg>
  ),
  Flag: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 21V4" /><path d="M5 4h13l-3 4 3 4H5" /></svg>
  ),
  Cpu: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></svg>
  ),
  Send: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" /></svg>
  ),
  Bot: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 2v4" /><circle cx="9" cy="14" r="1.2" fill="currentColor" /><circle cx="15" cy="14" r="1.2" fill="currentColor" /></svg>
  ),
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 18l6-6-6-6" /></svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 6.5 7 1-5 5 1.2 7-6.2-3.4-6.2 3.4 1.2-7-5-5 7-1Z" /></svg>
  ),
  Logout: (p) => (
    <svg viewBox="0 0 24 24" {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
  ),
};
