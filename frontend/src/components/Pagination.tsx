import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/40 text-slate-400 transition-all hover:border-brand-cyan/30 hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <React.Fragment key={page}>
            {showEllipsis && <span className="px-1 text-slate-600">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[2.25rem] h-9 px-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan'
                  : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-brand-cyan/30 hover:text-white'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/40 text-slate-400 transition-all hover:border-brand-cyan/30 hover:text-brand-cyan disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
