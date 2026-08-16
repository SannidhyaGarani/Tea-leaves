import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, breadcrumbItems = [] }) => {
  return (
    <section className="relative w-full bg-gradient-to-r from-[#173b25] via-[#1c442c] to-[#122e1d] text-[#f8f3e9] pt-[95px] sm:pt-[105px] md:pt-[110px] overflow-hidden border-b border-[#B38A45]/30 shadow-md">
      {/* Decorative ambient gold glows */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-[#B38A45]/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 w-64 h-64 bg-[#B38A45]/10 rounded-full blur-3xl" />

      {/* Decorative background leaf silhouette */}
      <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 opacity-5 text-[#B38A45]">
        <Leaf size={180} strokeWidth={1} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6 md:py-7 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        <div className="max-w-2xl">
          {/* Eyebrow & Breadcrumbs Row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/30 text-[#B38A45] text-[9px] font-extrabold uppercase tracking-[0.25em]">
              <Sparkles size={10} className="text-[#B38A45]" />
              <span>Vaarta Chai</span>
            </div>

            {breadcrumbItems.length > 0 && (
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#e3d9c6]/70">
                <span className="text-[#B38A45]/60">•</span>
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  const isFirst = index === 0;

                  if (isLast) {
                    return (
                      <span key={index} className="text-[#B38A45] font-extrabold">
                        {item.label}
                      </span>
                    );
                  }

                  return (
                    <React.Fragment key={index}>
                      <Link
                        to={item.path || "/"}
                        className="flex items-center gap-1 text-[#e3d9c6]/80 hover:text-[#B38A45] transition-colors"
                      >
                        {isFirst && <Home size={11} />}
                        <span>{item.label}</span>
                      </Link>
                      <ChevronRight size={10} className="text-[#B38A45]/50" strokeWidth={2.5} />
                    </React.Fragment>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Title */}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#fffdf8] tracking-tight leading-tight"
            >
              {title}
            </motion.h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="text-xs sm:text-sm text-[#d4cbb8] font-normal leading-relaxed mt-1 max-w-xl line-clamp-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Right side subtle quality badge */}
        <div className="hidden md:flex flex-col items-end shrink-0 border-l border-[#B38A45]/20 pl-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#B38A45]">100% Single Origin</span>
          <span className="text-[9px] text-[#a8bdae] tracking-wider uppercase mt-0.5">Direct From Assam Estates</span>
        </div>

      </div>
    </section>
  );
};

export default PageHeader;
