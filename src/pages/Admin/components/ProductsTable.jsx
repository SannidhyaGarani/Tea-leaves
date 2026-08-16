import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const statusBadgeClasses = (status) => {
  switch (status) {
    case "In Stock":
      return "bg-emerald-950/80 text-emerald-400 border-emerald-800/50";
    case "Low Stock":
      return "bg-amber-950/80 text-amber-400 border-amber-800/50";
    default:
      return "bg-red-950/80 text-red-400 border-red-800/50";
  }
};

const ProductsTable = ({ products, onEdit, onDelete }) => {
  return (
    <section className="bg-[#12221a] rounded-2xl border border-[#1b3327] shadow-xl overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between border-b border-[#1b3327]">
        <div>
          <h2 className="text-lg font-poppins font-bold text-[#f4f6f4]">Tea Catalog</h2>
          <p className="text-xs text-[#9cb5a4] mt-0.5">
            Manage your tea varieties and stock inventory
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-[#1b3327] border border-[#c9a962]/30 text-[#c9a962] text-xs font-bold">
          {products.length} Products
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0a140f]">
            <tr className="text-[11px] font-bold text-[#648773] uppercase tracking-widest">
              <th className="px-6 py-3.5">Product</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Caffeine / Type</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Qty</th>
              <th className="px-6 py-3.5">Stock</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b3327]">
            {products.map((row) => (
              <tr key={row.id} className="hover:bg-[#162a20]/60 transition-colors">
                <td className="px-6 py-4 text-[#f4f6f4] font-medium">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-10 h-12 rounded overflow-hidden bg-[#0a140f] flex-shrink-0 border border-[#1b3327] shadow-sm">
                      <img
                        src={row.image || row.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=200&auto=format&fit=crop'}
                        alt={row.name}
                        className="w-full h-full object-cover"
                      />
                      {row.images?.length > 1 && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#c9a962] rounded-bl-sm" title="Multiple photos available (2nd used for hover)" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-[#f4f6f4] block">{row.name}</span>
                      {row.images?.length > 1 && (
                        <span className="text-[10px] text-[#c9a962] font-bold uppercase tracking-wider block">
                          ✦ {row.images.length} Photos (Hover Enabled)
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#9cb5a4]">
                  {row.category || "-"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                    row.caffeine?.includes('High') ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40' :
                    row.caffeine?.includes('Free') ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40' :
                    'bg-[#1b3327] text-[#a3b8ac] border border-[#274435]'
                  }`}>
                    {row.caffeine || "Medium Caffeine"}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#c9a962] font-bold">
                  ₹{Number(row.price || 0).toFixed(0)}
                </td>
                <td className="px-6 py-4 text-[#f4f6f4] font-bold tabular-nums">
                  {row.stock ?? '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${statusBadgeClasses(row.stock_status || "In Stock")}`}
                  >
                    {row.stock_status || "In Stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg bg-[#1b3327] text-[#c9a962] hover:bg-[#c9a962] hover:text-[#0a140f] transition-colors border border-[#274435]"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors border border-red-900/40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-zinc-500"
                >
                  No products yet. Click &quot;Add Product&quot; to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductsTable;
