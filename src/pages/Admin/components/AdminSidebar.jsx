import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  Package,
  Grid,
  Layers,
  Sparkles,
  Sliders,
  ClipboardCheck,
  ShoppingCart,
  Undo2,
  Users,
  Percent,
  Layout,
  Image,
  BookOpen,
  FileText,
  Star,
  Heart,
  Mail,
  Settings,
  CreditCard,
  Truck,
  Landmark,
  ShieldAlert,
  Globe,
  History,
  HelpCircle,
  LogOut,
  Leaf,
  Warehouse,
  X
} from 'lucide-react';

const sidebarSections = [
  {
    title: "DASHBOARD",
    items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Analytics", icon: BarChart3 },
      { name: "Reports", icon: ClipboardList }
    ]
  },
  {
    title: "CATALOG",
    items: [
      { name: "Products", icon: Package },
      { name: "Stock Manager", icon: Warehouse },
      { name: "Categories", icon: Grid },
      { name: "Subcategories", icon: Layers },
      { name: "Collections", icon: Sparkles },
      { name: "Attributes", icon: Sliders },
      { name: "Inventory", icon: ClipboardCheck }
    ]
  },
  {
    title: "SALES",
    items: [
      { name: "Orders", icon: ShoppingCart },
      { name: "Returns / Refunds", icon: Undo2 },
      { name: "Customers", icon: Users },
      { name: "Coupons / Offers", icon: Percent }
    ]
  },
  {
    title: "CONTENT",
    items: [
      { name: "Hero Slides", icon: Layout },
      { name: "Shop By Category", icon: Grid },
      { name: "Brewing Rituals", icon: Sparkles },
      { name: "Community Gallery", icon: Image },
      { name: "Benefits Strip", icon: ClipboardList },
      { name: "Blogs", icon: BookOpen },
      { name: "Pages", icon: FileText }
    ]
  },
  {
    title: "CUSTOMER ENGAGEMENT",
    items: [
      { name: "Reviews", icon: Star },
      { name: "Wishlists", icon: Heart },
      { name: "Newsletter Subscribers", icon: Mail }
    ]
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Store Settings", icon: Settings },
      { name: "Payment Settings", icon: CreditCard },
      { name: "Shipping Settings", icon: Truck },
      { name: "Tax Settings", icon: Landmark },
      { name: "Users & Roles", icon: ShieldAlert },
      { name: "SEO Settings", icon: Globe }
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Activity Logs", icon: History }
    ]
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Help / Documentation", icon: HelpCircle }
    ]
  }
];

const AdminSidebar = ({ activeItem, setActiveItem, isOpen, onClose }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#1b3327] bg-[#0e1a14] text-[#b0c4b8] flex flex-col h-screen shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 selection:bg-[#c9a962] selection:text-[#0a140f] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-[#1b3327] sticky top-0 bg-[#0a140f] z-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="https://res.cloudinary.com/dcjn4y284/image/upload/v1787474399/VARTA_CHAI_LOGO_NEW_PNG_2_gxlhbz.png"
              alt="Vaarta Chai Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-[#162a20] text-[#9cb5a4] hover:text-white rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-grow overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-[#1b3327]">
          {sidebarSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="text-[9px] font-bold text-[#648773] tracking-[0.2em] px-3 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.name === activeItem;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setActiveItem(item.name);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive
                        ? "bg-[#c9a962] text-[#0a140f] font-extrabold shadow-md shadow-[#c9a962]/15"
                        : "text-[#a3b8ac] hover:bg-[#162a20] hover:text-[#c9a962] border border-transparent"
                        }`}
                    >
                      <Icon size={14} strokeWidth={2} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-[#1b3327] bg-[#0a140f]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all border border-red-900/40"
          >
            <LogOut size={14} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
export { sidebarSections };
