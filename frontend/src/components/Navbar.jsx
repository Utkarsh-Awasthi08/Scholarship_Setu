import React from 'react';
import { BookOpen, Clock3, LogOut, Menu, MessageCircleHeart, Sparkles, UserRound, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Discover', path: '/', icon: Sparkles },
    { name: 'Guided chat', path: '/chat', icon: MessageCircleHeart },
    { name: 'Scholarships', path: '/scholarships', icon: BookOpen },
    { name: 'My applications', path: '/track', icon: Clock3 },
  ];

  const closeAndSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#e9e5dc]/70 bg-[#fffdf9]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#5541d8] text-white shadow-lg shadow-[#5541d8]/20 transition group-hover:-rotate-6 group-hover:scale-105"><BookOpen className="h-5 w-5" /></span>
          <span><span className="block text-lg font-extrabold tracking-tight text-[#182338]">ScholarSetu</span><span className="hidden text-[10px] font-bold tracking-[0.12em] text-[#8b847a] uppercase sm:block">Scholarship guide</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ name, path, icon: Icon }) => <Link key={name} to={path} className={`inline-flex items-center rounded-full px-3.5 py-2 text-sm font-bold transition ${location.pathname === path ? 'bg-[#eeebff] text-[#4a36ca]' : 'text-[#625e57] hover:bg-[#f3f0ea] hover:text-[#182338]'}`}><Icon className="mr-1.5 h-4 w-4" />{name}</Link>)}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? <><span className="inline-flex items-center rounded-full bg-[#f4f1eb] px-3 py-2 text-xs font-bold text-[#5f594f]"><span className="mr-2 grid h-5 w-5 place-items-center rounded-full bg-[#dff6ec] text-[#0d8861]"><UserRound className="h-3 w-3" /></span>{user.role === 'admin' ? 'Administrator' : user.email}</span><button onClick={closeAndSignOut} className="inline-flex items-center rounded-full px-3 py-2 text-sm font-bold text-[#625e57] transition hover:bg-[#fdf0ee] hover:text-[#bd3a29]"><LogOut className="mr-1.5 h-4 w-4" />Sign out</button></> : <Link to="/login" className="inline-flex items-center rounded-full bg-[#182338] px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#182338]/15 transition hover:-translate-y-0.5 hover:bg-[#2a3852]">Get started <span className="ml-2 text-[#f8c764]">→</span></Link>}
        </div>

        <button onClick={() => setIsOpen((open) => !open)} aria-label="Open navigation" className="grid h-10 w-10 place-items-center rounded-xl border border-[#e5dfd5] text-[#182338] lg:hidden">{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </nav>

      {isOpen && <div className="border-t border-[#ebe6dd] bg-[#fffdf9] px-4 py-4 shadow-xl lg:hidden"><div className="mx-auto grid max-w-7xl gap-1">{navLinks.map(({ name, path, icon: Icon }) => <Link key={name} to={path} onClick={() => setIsOpen(false)} className={`flex items-center rounded-xl px-3 py-3 text-sm font-bold ${location.pathname === path ? 'bg-[#eeebff] text-[#4a36ca]' : 'text-[#625e57]'}`}><Icon className="mr-3 h-4 w-4" />{name}</Link>)}<div className="my-2 border-t border-[#ebe6dd]" />{user ? <button onClick={closeAndSignOut} className="flex items-center rounded-xl px-3 py-3 text-left text-sm font-bold text-[#bd3a29]"><LogOut className="mr-3 h-4 w-4" />Sign out</button> : <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center rounded-xl bg-[#182338] px-3 py-3 text-sm font-extrabold text-white">Get started</Link>}</div></div>}
    </header>
  );
};

export default Navbar;
