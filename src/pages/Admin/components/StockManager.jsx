import React, { useState, useEffect } from 'react';
import { db } from '../../../components/Firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Package, Edit3, Save, X, AlertTriangle, CheckCircle2, RefreshCw, Minus, Plus } from 'lucide-react';

const statusBadge = (stock) => {
  const s = Number(stock) || 0;
  if (s === 0) return { label: 'Out of Stock', cls: 'bg-red-950/80 text-red-400 border-red-800/50' };
  if (s <= 5) return { label: 'Low Stock', cls: 'bg-amber-950/80 text-amber-400 border-amber-800/50' };
  return { label: 'In Stock', cls: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' };
};

const StockManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('StockManager error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    // Ensure every variant has a stock field
    const sizePrices = (product.size_prices || []).map(sp => ({
      ...sp,
      stock: Number(sp.stock) ?? 0,
    }));
    setEditData({ sizePrices });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const setVariantStock = (idx, value) => {
    setEditData(prev => {
      const copy = [...prev.sizePrices];
      copy[idx] = { ...copy[idx], stock: Math.max(0, Number(value) || 0) };
      return { ...prev, sizePrices: copy };
    });
  };

  const adjustStock = (idx, delta) => {
    setEditData(prev => {
      const copy = [...prev.sizePrices];
      const newVal = Math.max(0, (Number(copy[idx].stock) || 0) + delta);
      copy[idx] = { ...copy[idx], stock: newVal };
      return { ...prev, sizePrices: copy };
    });
  };

  const saveStock = async (product) => {
    setSaving(product.id);
    try {
      const updatedSizePrices = editData.sizePrices.map(sp => ({
        ...sp,
        stock: Number(sp.stock) || 0,
      }));

      const totalStock = updatedSizePrices.reduce((sum, sp) => sum + sp.stock, 0);
      const firstVariantStock = updatedSizePrices[0]?.stock ?? 0;
      const stockStatus =
        totalStock === 0 ? 'Out of Stock' : firstVariantStock <= 5 ? 'Low Stock' : 'In Stock';

      await updateDoc(doc(db, 'products', product.id), {
        size_prices: updatedSizePrices,
        stock: totalStock,
        stock_status: stockStatus,
      });

      showToast(`Stock updated for "${product.name}"`);
      setEditingId(null);
      setEditData({});
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#9cb5a4] gap-3">
        <RefreshCw size={18} className="animate-spin text-[#c9a962]" />
        <span className="text-xs font-semibold uppercase tracking-widest">Loading stock data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f4f6f4] uppercase tracking-wider font-serif">
            Stock Manager
          </h2>
          <p className="text-xs text-[#9cb5a4] mt-1">
            Manage per-variant stock levels. Changes update in real time across the entire site.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#162a20] border border-[#c9a962]/30 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-[#c9a962] font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: 'text-[#c9a962]' },
          {
            label: 'In Stock',
            value: products.filter(p => p.stock_status === 'In Stock').length,
            color: 'text-emerald-400',
          },
          {
            label: 'Out of Stock',
            value: products.filter(p => p.stock_status === 'Out of Stock').length,
            color: 'text-red-400',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-[#12221a] border border-[#1b3327] rounded-xl p-4 text-center"
          >
            <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-[#9cb5a4] uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Product list */}
      {products.length === 0 ? (
        <div className="bg-[#12221a] border border-[#1b3327] rounded-2xl p-10 text-center text-[#648773] text-xs">
          No products found. Add products from the Products section.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => {
            const isEditing = editingId === product.id;
            const variants = isEditing
              ? editData.sizePrices
              : product.size_prices || [{ size: 'Default', stock: product.stock ?? 0 }];

            return (
              <div
                key={product.id}
                className={`bg-[#12221a] border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isEditing ? 'border-[#c9a962]/60 shadow-lg shadow-[#c9a962]/5' : 'border-[#1b3327]'
                }`}
              >
                {/* Product header row */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-[#1b3327]">
                  {/* Thumbnail */}
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#0a140f] border border-[#1b3327] shrink-0">
                    <img
                      src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=100&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-bold text-[#f4f6f4] truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-[#9cb5a4] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {(() => {
                        const badge = statusBadge(product.stock);
                        return (
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.cls}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                      <span className="text-[9px] text-[#648773]">
                        Total: {product.stock ?? 0} units
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveStock(product)}
                          disabled={saving === product.id}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#c9a962] text-[#0a140f] text-xs font-bold rounded-lg hover:bg-[#d9b871] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {saving === product.id ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Save size={13} />
                          )}
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-2 border border-[#1b3327] text-[#9cb5a4] text-xs font-bold rounded-lg hover:bg-[#162a20] transition-all cursor-pointer"
                        >
                          <X size={13} /> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#162a20] border border-[#c9a962]/40 text-[#c9a962] text-xs font-bold rounded-lg hover:bg-[#c9a962] hover:text-[#0a140f] transition-all cursor-pointer"
                      >
                        <Edit3 size={13} /> Edit Stock
                      </button>
                    )}
                  </div>
                </div>

                {/* Variant stock rows */}
                <div className="px-5 py-4">
                  <div className="grid gap-3">
                    {variants.map((sp, idx) => {
                      const badge = statusBadge(isEditing ? editData.sizePrices[idx]?.stock : sp.stock);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-[#0a140f] border border-[#1b3327] rounded-xl px-4 py-3"
                        >
                          {/* Variant label */}
                          <div className="min-w-[80px]">
                            <span className="text-xs font-bold text-[#f4f6f4] uppercase tracking-wider">
                              {sp.size || 'Default'}
                            </span>
                            <span className="text-[10px] text-[#9cb5a4] block">
                              ₹{sp.price?.toLocaleString()}
                            </span>
                          </div>

                          {/* Status badge */}
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border ${badge.cls}`}>
                            {badge.label}
                          </span>

                          <div className="flex-grow" />

                          {/* Stock control */}
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => adjustStock(idx, -1)}
                                className="w-8 h-8 rounded-lg bg-[#162a20] border border-[#1b3327] text-[#9cb5a4] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <Minus size={13} />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={editData.sizePrices[idx]?.stock ?? 0}
                                onChange={e => setVariantStock(idx, e.target.value)}
                                className="w-20 text-center px-2 py-1.5 bg-[#162a20] border border-[#c9a962]/50 rounded-lg text-sm font-black text-[#c9a962] outline-none focus:border-[#c9a962]"
                              />
                              <button
                                onClick={() => adjustStock(idx, 1)}
                                className="w-8 h-8 rounded-lg bg-[#162a20] border border-[#1b3327] text-[#9cb5a4] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className={`text-lg font-black font-mono ${
                                (Number(sp.stock) || 0) === 0 ? 'text-red-400' :
                                (Number(sp.stock) || 0) <= 5 ? 'text-amber-400' : 'text-emerald-300'
                              }`}>
                                {Number(sp.stock) || 0}
                              </span>
                              <span className="text-[9px] text-[#648773] block">units</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold transition-all ${
          toast.type === 'error'
            ? 'bg-red-950 border-red-800/50 text-red-300'
            : 'bg-[#162a20] border-[#c9a962]/40 text-[#c9a962]'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default StockManager;
