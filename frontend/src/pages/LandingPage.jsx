import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  FileScan,
  IndianRupee,
  Landmark,
  Languages,
  MessageCircleHeart,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';


const process = [
  { number: '01', title: 'Tell us your story', text: 'Chat naturally in English or Hindi. We turn everyday answers into a scholarship profile.', icon: MessageCircleHeart, tone: 'bg-[#e8e5ff] text-[#5541d8]' },
  { number: '02', title: 'Keep documents ready', text: 'Upload a clear photo when requested and see what our verification checks for.', icon: FileScan, tone: 'bg-[#dff6ec] text-[#0a8855]' },
  { number: '03', title: 'Choose with clarity', text: 'Compare the schemes that fit your profile, then save the ones you want to pursue.', icon: Sparkles, tone: 'bg-[#fff0c9] text-[#c27300]' },
];

const features = [
  { title: 'A conversation, not a confusing form', text: 'The assistant moves one question at a time and lets you confirm each important detail.', icon: MessageCircleHeart, className: 'md:col-span-2 bg-[#182338] text-white' },
  { title: 'Made for MP students', text: 'Built around Madhya Pradesh schemes alongside central opportunities.', icon: Landmark, className: 'bg-[#e6f4ec] text-[#174b39]' },
  { title: 'Your documents, checked', text: 'OCR reads relevant details and flags a document for a person when confidence is low.', icon: ScanLine, className: 'bg-[#f5eaff] text-[#40206e]' },
  { title: 'Hindi when you need it', text: 'Ask for the current question in Hindi whenever something is unclear.', icon: Languages, className: 'bg-[#fff2db] text-[#793d08]' },
  { title: 'Recommendations you can understand', text: 'Each suggestion shows its match score, eligibility context, amount, and official portal.', icon: BadgeCheck, className: 'md:col-span-2 bg-white text-[#182338] border border-[#e7e2d8]' },
];

const LandingPage = () => {
  return (
    <div className="overflow-hidden bg-[#f8f7f2]">
      <section className="hero-grid relative isolate overflow-hidden bg-[#182338] px-4 pb-20 pt-14 text-white sm:px-6 lg:pb-24 lg:pt-20">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#6958ed] opacity-25 blur-3xl" />
        <div className="absolute right-[-12rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#0cb47c] opacity-20 blur-3xl" />
        <div className="absolute bottom-[-11rem] left-1/3 h-72 w-[36rem] rounded-full bg-[#edb64b] opacity-10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="max-w-2xl lg:py-7">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-[#d9d4ff] uppercase backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#f7c45d]" /> Scholarship guidance, made human
            </div>
            <h1 className="font-display text-balance text-5xl leading-[.95] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              Every ambition deserves a way forward.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#ced5e1] sm:text-xl">
              ScholarSetu helps students discover the scholarships that fit their story, gather their details with confidence, and stay on top of every application.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/login" className="group inline-flex items-center justify-center rounded-full bg-[#f8c764] px-6 py-3.5 text-sm font-extrabold text-[#182338] transition hover:-translate-y-0.5 hover:bg-[#ffda84] hover:shadow-lg hover:shadow-black/20">
                Find your scholarships <ArrowUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">See how it works <ChevronRight className="ml-1 h-4 w-4" /></a>
            </div>
            <div className="mt-11 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#cad2df]">
              <span className="inline-flex items-center"><Check className="mr-2 h-4 w-4 text-[#79e2b8]" />Built for MP &amp; central schemes</span>
              <span className="inline-flex items-center"><Check className="mr-2 h-4 w-4 text-[#79e2b8]" />English and Hindi guidance</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem]">
            <div className="absolute -inset-5 rounded-[2.2rem] border border-white/10 bg-white/5 rotate-3" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#fdfcf9] p-3 shadow-2xl shadow-black/35">
              <div className="overflow-hidden rounded-[1.45rem] bg-[#f4f1eb]">
                <div className="flex items-center justify-between bg-[#fffdf9] px-5 py-4">
                  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#5541d8] text-white shadow-lg shadow-[#5541d8]/20"><Sparkles className="h-5 w-5" /></div><div><p className="text-sm font-extrabold text-[#182338]">ScholarSetu guide</p><p className="text-xs font-medium text-[#57846e]">● Here to help</p></div></div>
                  <span className="rounded-full bg-[#ebe9ff] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-[#5541d8] uppercase">Step 3 of 6</span>
                </div>
                <div className="space-y-4 px-5 py-6">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-[#344054] shadow-sm">Based on your profile, these scholarships may be a strong fit.</div>
                  <div className="rounded-2xl border border-[#e4ded3] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a8174]">Recommended</p><h2 className="mt-1 text-[15px] font-extrabold leading-5 text-[#182338]">Mukhyamantri Medhavi Vidyarthi Yojana</h2></div><span className="rounded-lg bg-[#dff6ec] px-2 py-1 text-xs font-extrabold text-[#087246]">92%</span></div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#eeeae2] pt-3"><span className="inline-flex items-center text-xs font-bold text-[#645d53]"><IndianRupee className="mr-1 h-3.5 w-3.5" />Fee support</span><span className="text-xs font-bold text-[#5541d8]">View details →</span></div>
                  </div>
                  <div className="flex justify-end"><div className="rounded-2xl rounded-tr-sm bg-[#5541d8] px-4 py-3 text-sm font-semibold text-white">Show me more options</div></div>
                </div>
                <div className="border-t border-[#e5dfd6] bg-[#fffdf9] px-5 py-4"><div className="flex items-center gap-2 rounded-xl border border-[#e1dbd1] bg-white px-3 py-2.5 text-sm text-[#9b948a]"><MessageCircleHeart className="h-4 w-4 text-[#5541d8]" />Ask anything about your eligibility…</div></div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-6 hidden rounded-2xl border border-white/20 bg-[#0d8861] px-4 py-3 text-white shadow-xl sm:block"><p className="text-xs font-bold uppercase tracking-wider text-[#baf0d9]">Document check</p><p className="mt-1 text-sm font-extrabold">Ready for review <Check className="ml-1 inline h-4 w-4" /></p></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl border border-[#e7e2d8] bg-[#fffdf9] shadow-xl shadow-[#182338]/10 sm:grid-cols-3">
          <div className="border-b border-[#e7e2d8] px-6 py-5 sm:border-b-0 sm:border-r"><p className="font-display text-3xl text-[#5541d8]">14+</p><p className="mt-1 text-sm font-semibold text-[#5d5a54]">Scholarship schemes seeded</p></div>
          <div className="border-b border-[#e7e2d8] px-6 py-5 sm:border-b-0 sm:border-r"><p className="font-display text-3xl text-[#0d8861]">2 languages</p><p className="mt-1 text-sm font-semibold text-[#5d5a54]">Guidance in English and Hindi</p></div>
          <div className="px-6 py-5"><p className="font-display text-3xl text-[#c97909]">One profile</p><p className="mt-1 text-sm font-semibold text-[#5d5a54]">For every scheme you choose to explore</p></div>
        </div>
      </section>

      <section id="how-it-works" className="paper-grid px-4 pb-24 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold tracking-[0.18em] text-[#5541d8] uppercase">Simple by design</p><h2 className="mt-3 font-display text-balance text-4xl leading-tight text-[#182338] sm:text-5xl">A clearer path from question to opportunity.</h2><p className="mt-4 text-base leading-7 text-[#656059]">ScholarSetu turns a long application process into a focused, guided conversation.</p></div>
          <div className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16%] right-[16%] top-12 hidden h-px border-t-2 border-dashed border-[#c9c2b6] md:block" />
            {process.map(({ number, title, text, icon: Icon, tone }) => <article key={number} className="relative rounded-3xl border border-[#e5dfd5] bg-[#fffdf9] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#182338]/10"><div className="flex items-center justify-between"><span className={`grid h-14 w-14 place-items-center rounded-2xl ${tone}`}><Icon className="h-7 w-7" /></span><span className="font-display text-2xl text-[#b8afa2]">{number}</span></div><h3 className="mt-7 text-xl font-extrabold tracking-tight text-[#182338]">{title}</h3><p className="mt-3 leading-7 text-[#656059]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf9] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-xs font-extrabold tracking-[0.18em] text-[#0d8861] uppercase">Thoughtful support</p><h2 className="mt-3 font-display text-balance text-4xl leading-tight text-[#182338] sm:text-5xl">The important parts of applying, brought together.</h2></div><Link to="/scholarships" className="inline-flex items-center font-bold text-[#5541d8] transition hover:text-[#3f2ba8]">Browse scholarship schemes <ArrowUpRight className="ml-2 h-4 w-4" /></Link></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ title, text, icon: Icon, className }) => <article key={title} className={`group rounded-3xl p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-current"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-5 w-5 opacity-50 transition group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="mt-12 text-xl font-extrabold tracking-tight">{title}</h3><p className="mt-3 max-w-lg text-sm leading-6 opacity-75">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#e9e4fb] px-4 py-16 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-[#5541d8] px-7 py-9 text-white shadow-xl shadow-[#5541d8]/25 md:flex-row md:items-center md:px-12"><div><p className="text-xs font-extrabold tracking-[0.18em] text-[#d4cdff] uppercase">Your next step</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Start with the questions you already know.</h2><p className="mt-3 max-w-xl leading-7 text-[#e4e0ff]">No need to understand every scheme first. We will help you build the picture, one answer at a time.</p></div><Link to="/login" className="inline-flex shrink-0 items-center rounded-full bg-[#f8c764] px-6 py-3.5 text-sm font-extrabold text-[#182338] transition hover:bg-[#ffda84]">Create your account <ChevronRight className="ml-1 h-4 w-4" /></Link></div></section>

      <footer className="bg-[#182338] px-4 py-10 text-[#cbd3df] sm:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-xl font-extrabold text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5541d8]"><BookOpen className="h-4 w-4" /></span>ScholarSetu</div><p className="mt-3 max-w-sm text-sm leading-6">A calmer way to discover scholarship opportunities and prepare your application.</p></div><div className="flex gap-5 text-sm font-semibold"><span className="inline-flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-[#79e2b8]" />Privacy conscious</span><span className="inline-flex items-center"><Languages className="mr-2 h-4 w-4 text-[#f8c764]" />Hindi ready</span></div></div><div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-[#8793a4]">© {new Date().getFullYear()} ScholarSetu. Built to make scholarship access more approachable.</div></footer>
    </div>
  );
};

export default LandingPage;
