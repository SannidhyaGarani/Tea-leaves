import { CheckCircle2, Search, Bell, Sun, Menu } from 'lucide-react';

const AdminHeader = ({ activeItem, searchVal, setSearchVal, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between pb-5 border-b border-[#1b3327] mb-8 bg-[#0a140f] pt-2 px-4 rounded-xl">
      <div className="flex items-center gap-3 md:gap-6 flex-1 max-w-lg">
        {/* Mobile Hamburger toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#9cb5a4] hover:text-[#c9a962] rounded-lg hover:bg-[#162a20]"
        >
          <Menu size={18} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#648773]" />
          <input
            type="text"
            placeholder="Search tea products, orders..."
            value={searchVal || ''}
            onChange={(e) => setSearchVal?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#12221a] border border-[#1b3327] rounded-lg text-xs text-[#e2e8e4] placeholder-[#648773] focus:outline-none focus:border-[#c9a962] transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Signup link */}
        <a 
          href="/admin/signup" 
          className="px-3 py-1.5 border border-[#1b3327] bg-[#12221a] text-[#9cb5a4] hover:text-[#c9a962] hover:border-[#c9a962]/40 text-xs font-semibold rounded-lg transition-all"
        >
          + Add Admin
        </a>

        {/* View Store link */}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-1.5 border border-[#c9a962]/40 bg-[#162a20] text-[#c9a962] hover:bg-[#c9a962] hover:text-[#0a140f] text-xs font-semibold rounded-lg transition-all shadow-sm"
        >
          View Store &nearr;
        </a>

        {/* Notifications and Profile */}
        <button className="p-2 text-[#9cb5a4] hover:text-[#c9a962] rounded-lg hover:bg-[#162a20] relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c9a962]" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-[#1b3327]">
          <div className="w-8 h-8 rounded-full bg-[#1b3327] border border-[#c9a962]/50 flex items-center justify-center text-xs font-bold text-[#c9a962] uppercase overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-[#f4f6f4] leading-none">Tea Master Admin</p>
            <p className="text-[9px] text-[#c9a962] uppercase tracking-widest mt-0.5 font-semibold">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
