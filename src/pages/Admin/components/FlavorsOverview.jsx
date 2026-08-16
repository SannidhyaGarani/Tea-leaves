import React from 'react';
import { Sparkles, Leaf, Coffee, Flame, Droplets, Sun } from 'lucide-react';

const flavorStats = [
  { name: "Classic Assam CTC", count: 6, icon: Leaf, color: "text-[#4A5D4E]", bg: "bg-[#4A5D4E]/10" },
  { name: "Elaichi Chai", count: 4, icon: Sparkles, color: "text-[#D9A036]", bg: "bg-[#D9A036]/10" },
  { name: "Rose Herbal", count: 3, icon: Droplets, color: "text-pink-600", bg: "bg-pink-100" },
  { name: "Masala Chai Spiced", count: 5, icon: Flame, color: "text-orange-700", bg: "bg-orange-100" },
  { name: "Matcha Green Tea", count: 3, icon: Sun, color: "text-emerald-700", bg: "bg-emerald-100" },
  { name: "Chamomile Mint", count: 2, icon: Coffee, color: "text-amber-900", bg: "bg-amber-100" },
];

const FlavorsOverview = () => {
  return (
    <section className="bg-[#12221a] rounded-2xl border border-[#1b3327] shadow-xl p-6">
      <h2 className="text-lg font-poppins font-bold text-[#f4f6f4] mb-1.5">
        Tea Flavors Overview
      </h2>
      <p className="text-sm text-[#9cb5a4] mb-6">
        Manage your artisanal tea catalog
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flavorStats.map((flavor) => {
          const Icon = flavor.icon;
          return (
            <div key={flavor.name} className="rounded-xl border border-[#1b3327] bg-[#0a140f] px-5 py-4 hover:border-[#c9a962]/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#162a20] text-[#c9a962] border border-[#274435] flex items-center justify-center">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f4f6f4]">{flavor.name}</p>
                  <p className="text-sm font-bold text-[#c9a962]">{flavor.count} Products</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FlavorsOverview;
