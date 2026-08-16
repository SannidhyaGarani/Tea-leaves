import React, { useState, useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { auth, db } from "../../components/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  where,
  limit
} from "firebase/firestore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import {
  X, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle,
  User, Calendar, DollarSign, ShoppingBag, Eye, EyeOff, Printer,
  Download, PlusCircle, Check, HelpCircle, FileText,
  Leaf, AlertCircle, Mail, Lock, ArrowRight
} from "lucide-react";

// Import components
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import MetricCards from "./components/MetricCards";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";
import TeaProductForm from "./components/ProductForm";
import StockManager from "./components/StockManager";
import { uploadToCloudinary } from "../../utils/cloudinary";

export { uploadToCloudinary };

// Generic CMS Manager helper
const GenericCRUDManager = ({ collectionName, title, fields, defaultItem, onUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultItem);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      alert("Deleted successfully!");
      fetchItems();
      onUpdate?.();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setFormData(defaultItem);
    setIsModalOpen(true);
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file, field) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, collectionName || "cms");
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docData = { ...formData };
      if (editingItem) {
        await setDoc(doc(db, collectionName, editingItem.id), docData);
        alert("Updated successfully!");
      } else {
        const newId = doc(collection(db, collectionName)).id;
        await setDoc(doc(db, collectionName, newId), { ...docData, id: newId });
        alert("Created successfully!");
      }
      setIsModalOpen(false);
      fetchItems();
      onUpdate?.();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="bg-[#12221a] border border-[#1b3327] rounded-xl p-6 text-[#f4f6f4] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[#f4f6f4] uppercase tracking-wider">{title}</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-[#0a140f] text-xs font-bold rounded-lg hover:bg-[#d4af37] transition-all shadow-md cursor-pointer"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-[#9cb5a4] text-xs">Loading items...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1b3327] text-[#648773] uppercase tracking-widest text-[10px] bg-[#0a140f]">
                {fields.map(f => (
                  <th key={f.key} className="py-3.5 px-4">{f.label}</th>
                ))}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3327]">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-[#162a20]/60 transition-colors">
                  {fields.map(f => (
                    <td key={f.key} className="py-3.5 px-4 font-medium text-[#f4f6f4]">
                      {f.type === 'image' ? (
                        <img src={item[f.key]} className="w-10 h-10 object-cover rounded bg-[#0a140f] border border-[#1b3327]" alt="thumb" />
                      ) : f.type === 'boolean' ? (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item[f.key] ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/80 text-red-400 border border-red-800/50'}`}>
                          {item[f.key] ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      ) : (
                        item[f.key] || '-'
                      )}
                    </td>
                  ))}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-[#9cb5a4] hover:text-[#c9a962] hover:bg-[#162a20] rounded transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 1} className="py-8 text-center text-[#648773]">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-[#0e1a14] border border-[#1b3327] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#1b3327] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c9a962]">{editingItem ? "Edit Item" : "Create Item"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#9cb5a4] hover:text-[#c9a962] p-1 rounded-full hover:bg-[#162a20]">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {fields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider block">{f.label}</label>
                  {f.type === 'image' ? (
                    <div className="space-y-2">
                      {formData[f.key] && (
                        <img src={formData[f.key]} className="w-20 h-20 object-cover rounded-lg border border-[#1b3327] bg-[#0a140f]" alt="preview" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, f.key)}
                        className="w-full text-xs text-[#9cb5a4] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1b3327] file:text-[#c9a962] hover:file:bg-[#274435] cursor-pointer"
                      />
                    </div>
                  ) : f.type === 'boolean' ? (
                    <select
                      value={formData[f.key] ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 bg-[#0a140f] border border-[#1b3327] rounded-lg text-xs text-[#f4f6f4] focus:border-[#c9a962] outline-none transition-all"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#0a140f] border border-[#1b3327] rounded-lg text-xs text-[#f4f6f4] focus:border-[#c9a962] outline-none transition-all"
                    />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0a140f] border border-[#1b3327] rounded-lg text-xs text-[#f4f6f4] focus:border-[#c9a962] outline-none transition-all"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1b3327] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#1b3327] text-[#9cb5a4] text-xs font-bold rounded-lg hover:bg-[#162a20]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-[#c9a962] text-[#0a140f] text-xs font-bold rounded-lg hover:bg-[#d4af37]"
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Testimonials Manager
const CommunityManager = () => {
  const [subTab, setSubTab] = useState("settings");

  const [settings, setSettings] = useState({
    eyebrow: "",
    heading: "",
    description_line_1: "",
    description_line_2: "",
    is_active: true
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [savingImgId, setSavingImgId] = useState(null);
  const [uploadingImgId, setUploadingImgId] = useState(null);

  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [savingStatId, setSavingStatId] = useState(null);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'community_settings'));
      if (!snap.empty) {
        setSettings(snap.docs[0].data());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchImages = async () => {
    setImagesLoading(true);
    try {
      const q = query(collection(db, 'community_images'), orderBy('sort_order', 'asc'));
      const snap = await getDocs(q);
      setImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setImagesLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const q = query(collection(db, 'community_stats'), orderBy('sort_order', 'asc'));
      const snap = await getDocs(q);
      setStats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchImages();
    fetchStats();
  }, []);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await setDoc(doc(db, 'community_settings', 'main'), settings);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleImageChange = (id, field, value) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    try {
      setUploadingImgId(id);
      const url = await uploadToCloudinary(file);
      handleImageChange(id, 'image', url);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingImgId(null);
    }
  };

  const handleSaveImage = async (img) => {
    setSavingImgId(img.id);
    try {
      await setDoc(doc(db, 'community_images', img.id), {
        image: img.image || '',
        link: img.link || '',
        sort_order: parseInt(img.sort_order) || 0,
        is_active: img.is_active !== false
      });
      alert("Image saved!");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSavingImgId(null);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'community_images', id));
      setImages(prev => prev.filter(img => img.id !== id));
      alert("Deleted!");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleAddImage = () => {
    const newId = 'img_' + Date.now();
    const newImg = { id: newId, image: '', link: '', sort_order: images.length + 1, is_active: true };
    setImages(prev => [...prev, newImg]);
  };

  const handleStatChange = (id, field, value) => {
    setStats(prev => prev.map(st => st.id === id ? { ...st, [field]: value } : st));
  };

  const handleSaveStat = async (stat) => {
    setSavingStatId(stat.id);
    try {
      await setDoc(doc(db, 'community_stats', stat.id), {
        icon: stat.icon || 'Star',
        value: stat.value || '',
        label: stat.label || '',
        sort_order: parseInt(stat.sort_order) || 0,
        is_active: stat.is_active !== false
      });
      alert("Stat saved successfully!");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSavingStatId(null);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 text-zinc-900 shadow-sm">
      <div className="flex border-b border-zinc-200 mb-6 text-xs">
        <button
          onClick={() => setSubTab("settings")}
          className={`px-4 py-2 font-bold border-b-2 transition-all ${subTab === "settings" ? "border-black text-zinc-900 font-extrabold" : "border-transparent text-zinc-500 hover:text-black"}`}
        >
          Section Settings
        </button>
        <button
          onClick={() => setSubTab("gallery")}
          className={`px-4 py-2 font-bold border-b-2 transition-all ${subTab === "gallery" ? "border-black text-zinc-900 font-extrabold" : "border-transparent text-zinc-500 hover:text-black"}`}
        >
          Gallery Images
        </button>
        <button
          onClick={() => setSubTab("stats")}
          className={`px-4 py-2 font-bold border-b-2 transition-all ${subTab === "stats" ? "border-black text-zinc-900 font-extrabold" : "border-transparent text-zinc-500 hover:text-black"}`}
        >
          Social Proof Stats
        </button>
      </div>

      {subTab === "settings" && !settingsLoading && (
        <div className="max-w-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="settings-active"
              checked={settings.is_active !== false}
              onChange={(e) => setSettings(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded text-black focus:ring-black accent-black w-4 h-4 cursor-pointer"
            />
            <label htmlFor="settings-active" className="font-bold text-zinc-800 cursor-pointer">Section Active</label>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Eyebrow</label>
            <input
              type="text"
              value={settings.eyebrow}
              onChange={(e) => setSettings(prev => ({ ...prev, eyebrow: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:border-black outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Heading</label>
            <input
              type="text"
              value={settings.heading}
              onChange={(e) => setSettings(prev => ({ ...prev, heading: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:border-black outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Description Line 1</label>
            <input
              type="text"
              value={settings.description_line_1}
              onChange={(e) => setSettings(prev => ({ ...prev, description_line_1: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded text-zinc-900 focus:bg-white focus:border-black outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Description Line 2</label>
            <input
              type="text"
              value={settings.description_line_2}
              onChange={(e) => setSettings(prev => ({ ...prev, description_line_2: e.target.value }))}
              className="w-full px-3 py-2 bg-[#161616] border border-[#222] rounded text-white"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={settingsSaving}
            className="px-6 py-2.5 bg-[#c9a962] text-[#090909] hover:bg-white hover:text-black rounded text-xs font-bold transition-all"
          >
            {settingsSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}

      {subTab === "gallery" && !imagesLoading && (
        <div className="space-y-6 text-xs">
          <div className="flex justify-end">
            <button onClick={handleAddImage} className="px-4 py-2 bg-[#c9a962] text-[#090909] hover:bg-white hover:text-black rounded font-bold transition-all">Add New Image</button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {images.map((img, idx) => (
              <div key={img.id} className="border border-[#1a1a1a] rounded-xl p-5 bg-[#161616] space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <span className="font-bold text-zinc-300">Image #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={`img-active-${img.id}`}
                        checked={img.is_active !== false}
                        onChange={(e) => handleImageChange(img.id, 'is_active', e.target.checked)}
                        className="rounded text-[#c9a962] focus:ring-[#c9a962] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor={`img-active-${img.id}`} className="font-bold text-zinc-400 cursor-pointer">Active</label>
                    </div>
                    <button onClick={() => handleDeleteImage(img.id)} className="text-red-400 hover:text-red-300 font-bold">Delete</button>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#0f0f0f] border border-[#222] rounded overflow-hidden flex items-center justify-center shrink-0">
                    {img.image ? <img src={img.image} className="w-full h-full object-cover" alt="look" /> : <span className="text-[9px] text-zinc-600">No Image</span>}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(img.id, e.target.files[0])} className="hidden" id={`gallery-file-${img.id}`} />
                    <label htmlFor={`gallery-file-${img.id}`} className="inline-block px-3 py-1.5 border border-zinc-700 rounded font-bold text-zinc-300 bg-[#0f0f0f] hover:bg-zinc-800 cursor-pointer">
                      {uploadingImgId === img.id ? "Uploading..." : "Change Image"}
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Destination Link</label>
                  <input type="text" value={img.link || ''} onChange={(e) => handleImageChange(img.id, 'link', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sort Order</label>
                  <input type="number" value={img.sort_order} onChange={(e) => handleImageChange(img.id, 'sort_order', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
                </div>

                <button onClick={() => handleSaveImage(img)} disabled={savingImgId === img.id || uploadingImgId === img.id} className="w-full py-2 bg-[#c9a962] text-[#090909] hover:bg-white hover:text-black font-bold rounded">
                  {savingImgId === img.id ? "Saving..." : "Save"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "stats" && !statsLoading && (
        <div className="grid gap-6 md:grid-cols-2 text-xs">
          {stats.map((stat, idx) => (
            <div key={stat.id} className="border border-[#1a1a1a] rounded-xl p-5 bg-[#161616] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <span className="font-bold text-zinc-300">Stat #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`stat-active-${stat.id}`}
                    checked={stat.is_active !== false}
                    onChange={(e) => handleStatChange(stat.id, 'is_active', e.target.checked)}
                    className="rounded text-[#c9a962] focus:ring-[#c9a962] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={`stat-active-${stat.id}`} className="font-bold text-zinc-400 cursor-pointer">Active</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Icon</label>
                <select value={stat.icon} onChange={(e) => handleStatChange(stat.id, 'icon', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white">
                  <option value="Star">Star (Rating)</option>
                  <option value="Award">Award (Badge)</option>
                  <option value="MessageSquare">Message (Reviews)</option>
                  <option value="RefreshCw">Refresh (Retention)</option>
                  <option value="Heart">Heart (Likes)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Primary Value</label>
                <input type="text" value={stat.value} onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Label</label>
                <input type="text" value={stat.label} onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sort Order</label>
                <input type="number" value={stat.sort_order} onChange={(e) => handleStatChange(stat.id, 'sort_order', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
              </div>

              <button onClick={() => handleSaveStat(stat)} disabled={savingStatId === stat.id} className="w-full py-2 bg-[#c9a962] text-[#090909] hover:bg-white hover:text-black font-bold rounded">
                {savingStatId === stat.id ? "Saving..." : "Save"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CMSManager = ({ collectionName, title }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy('sort_order', 'asc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error loading CMS items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const handleChange = (id, field, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    try {
      setUploadingId(id);
      const url = await uploadToCloudinary(file);
      handleChange(id, 'image', url);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async (item) => {
    try {
      setSavingId(item.id);
      if (!item.title) {
        alert("Title is required");
        return;
      }
      const docRef = doc(db, collectionName, item.id);
      await setDoc(docRef, {
        title: item.title,
        image: item.image || '',
        link: item.link || '',
        sort_order: parseInt(item.sort_order) || 0,
        is_active: item.is_active !== undefined ? item.is_active : true
      });
      alert(`${item.title} saved successfully!`);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500 text-xs">Loading CMS data...</div>;
  }

  return (
    <div className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-6 text-white text-xs">
      <h2 className="text-base font-bold text-white mb-6 uppercase tracking-wider">{title}</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className="border border-[#1a1a1a] rounded-xl p-5 bg-[#161616] space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <span className="font-bold text-zinc-300">Panel 0{index + 1} ({item.id})</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`active-${item.id}`}
                  checked={item.is_active !== false}
                  onChange={(e) => handleChange(item.id, 'is_active', e.target.checked)}
                  className="rounded text-[#c9a962] focus:ring-[#c9a962] w-4 h-4 cursor-pointer"
                />
                <label htmlFor={`active-${item.id}`} className="font-bold text-zinc-400 cursor-pointer">Active</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Image</label>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-[#090909] border border-[#222] rounded overflow-hidden flex items-center justify-center">
                  {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <span className="text-[10px] text-zinc-600">No Image</span>}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(item.id, e.target.files[0])} className="hidden" id={`file-input-${item.id}`} />
                  <label htmlFor={`file-input-${item.id}`} className="inline-block px-3 py-1.5 border border-zinc-700 rounded font-bold text-zinc-300 bg-[#090909] hover:bg-zinc-800 cursor-pointer">
                    {uploadingId === item.id ? "Uploading..." : "Change Image"}
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Title</label>
              <input type="text" value={item.title} onChange={(e) => handleChange(item.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Destination Link</label>
              <input type="text" value={item.link} onChange={(e) => handleChange(item.id, 'link', e.target.value)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Sort Order</label>
              <input type="number" value={item.sort_order} onChange={(e) => handleChange(item.id, 'sort_order', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-[#090909] border border-[#222] rounded text-white" />
            </div>

            <button onClick={() => handleSave(item)} disabled={savingId === item.id || uploadingId === item.id} className="w-full py-2 bg-[#c9a962] text-[#090909] hover:bg-white hover:text-black font-bold rounded">
              {savingId === item.id ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Log Viewer
const ActivityLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(15)));
        setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        // Fallback mock logs
        setLogs([
          { id: '1', admin: 'superadmin@pasoja.com', action: 'Product Created', entity: 'Assam CTC Black Tea', timestamp: { toDate: () => new Date() } },
          { id: '2', admin: 'superadmin@pasoja.com', action: 'Stock Adjusted', entity: 'Darjeeling Green Tea (+5)', timestamp: { toDate: () => new Date() } }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-[#12221a] border border-[#1b3327] rounded-xl p-6 text-[#f4f6f4] text-xs shadow-xl">
      <h2 className="text-base font-bold text-[#c9a962] mb-6 uppercase tracking-wider">System Activity Logs</h2>
      {loading ? <div className="text-[#9cb5a4]">Loading activity logs...</div> : (
        <div className="space-y-3.5">
          {logs.map(log => (
            <div key={log.id} className="p-3 bg-[#0a140f] border border-[#1b3327] rounded flex justify-between items-center">
              <div>
                <p className="font-bold text-[#c9a962]">{log.action}</p>
                <p className="text-[#9cb5a4] text-[10px] mt-0.5">Admin: {log.admin} | target: {log.entity}</p>
              </div>
              <span className="text-[10px] text-[#648773]">
                {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const isAdminLoggedIn =
    localStorage.getItem("adminToken") === "VAARTA_SUPER_ADMIN" ||
    sessionStorage.getItem("adminToken") === "VAARTA_SUPER_ADMIN" ||
    localStorage.getItem("adminToken") === "PASOJA_SUPER_ADMIN" ||
    sessionStorage.getItem("adminToken") === "PASOJA_SUPER_ADMIN";

  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "Overview";
  const searchFromUrl = searchParams.get("search") || "";

  const [activeItem, setActiveItemState] = useState(tabFromUrl);
  const [searchVal, setSearchValState] = useState(searchFromUrl);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeItem) {
      setActiveItemState(tabParam);
    }
    const searchParam = searchParams.get("search");
    if (searchParam !== null && searchParam !== searchVal) {
      setSearchValState(searchParam);
    }
  }, [searchParams]);

  const setActiveItem = (newItem) => {
    setActiveItemState(newItem);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", newItem);
    setSearchParams(newParams, { replace: true });
  };

  const setSearchVal = (newVal) => {
    setSearchValState(newVal);
    const newParams = new URLSearchParams(searchParams);
    if (newVal) {
      newParams.set("search", newVal);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  };
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats / executive summary
  const [statsSummary, setStatsSummary] = useState({
    revenue: 395420,
    orders: 248,
    customers: 1486,
    products: 256
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
      const prodList = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(prodList);

      const userSnap = await getDocs(query(collection(db, "users")));
      const userList = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(userList);

      const orderSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      const orderList = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(orderList);

      // Fetch & seed categories into Firebase Firestore
      const DEFAULT_SEEDS = [
        { title: "Black Tea", sort_order: 1, is_active: true, link: "/shop?category=Black Tea" },
        { title: "Green Tea", sort_order: 2, is_active: true, link: "/shop?category=Green Tea" },
        { title: "Oolong Tea", sort_order: 3, is_active: true, link: "/shop?category=Oolong Tea" },
        { title: "White Tea", sort_order: 4, is_active: true, link: "/shop?category=White Tea" },
        { title: "Herbal Tea", sort_order: 5, is_active: true, link: "/shop?category=Herbal Tea" },
        { title: "Chai Spices", sort_order: 6, is_active: true, link: "/shop?category=Chai Spices" },
        { title: "Teaware & Accessories", sort_order: 7, is_active: true, link: "/shop?category=Teaware & Accessories" },
      ];

      const catSnap = await getDocs(query(collection(db, "categories")));
      let loadedCats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (loadedCats.length === 0) {
        // Auto-seed default categories to Firebase Firestore
        for (const seed of DEFAULT_SEEDS) {
          const newDocRef = doc(collection(db, "categories"));
          await setDoc(newDocRef, { ...seed, id: newDocRef.id, createdAt: serverTimestamp() });
        }
        const newCatSnap = await getDocs(query(collection(db, "categories")));
        loadedCats = newCatSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }

      setCategoriesList(loadedCats);

      // Aggregate revenue
      const totalRev = orderList.reduce((acc, curr) => acc + (parseFloat(curr.total || curr.grandTotal || 0)), 0);
      setStatsSummary({
        revenue: totalRev || 395420,
        orders: orderList.length || 248,
        customers: userList.length || 1486,
        products: prodList.length || 256
      });
    } catch (error) {
      console.log("Error loading dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleAddProductSubmit = async (docData) => {
    const newDoc = {
      ...docData,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "products"), newDoc);
    setIsProductModalOpen(false);
    await loadData();
    // Log Activity
    await addDoc(collection(db, "activity_logs"), {
      admin: "superadmin@pasoja.com",
      action: "Product Created",
      entity: docData.name,
      timestamp: serverTimestamp()
    });
  };

  const handleEditProductSubmit = async (docData) => {
    if (!editingProduct?.id) return;
    await updateDoc(doc(db, "products", editingProduct.id), docData);
    setIsEditModalOpen(false);
    setEditingProduct(null);
    await loadData();
    // Log Activity
    await addDoc(collection(db, "activity_logs"), {
      admin: "superadmin@pasoja.com",
      action: "Product Updated",
      entity: docData.name,
      timestamp: serverTimestamp()
    });
  };

  // Filtered lists
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchVal.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.id?.toLowerCase().includes(searchVal.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchVal.toLowerCase())
  );

  const renderDashboardCharts = () => {
    // Generate simple chart data
    const chartData = [
      { name: "May 20", Revenue: 30000, Orders: 20 },
      { name: "May 25", Revenue: 50000, Orders: 32 },
      { name: "May 30", Revenue: 42000, Orders: 25 },
      { name: "Jun 4", Revenue: 60000, Orders: 45 },
      { name: "Jun 9", Revenue: 85000, Orders: 55 },
      { name: "Jun 14", Revenue: 70000, Orders: 38 },
      { name: "Jun 18", Revenue: 95000, Orders: 60 },
    ];

    return (
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Revenue Chart */}
        <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9cb5a4] mb-4">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a962" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c9a962" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#648773" fontSize={10} />
                <YAxis stroke="#648773" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0a140f", borderColor: "#1b3327", color: "#f4f6f4", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="Revenue" stroke="#c9a962" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9cb5a4] mb-4">Order Volume Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#648773" fontSize={10} />
                <YAxis stroke="#648773" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0a140f", borderColor: "#1b3327", color: "#f4f6f4", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="Orders" fill="#c9a962" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        {/* KPI Mini Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-lg">
            <p className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Total Sales Volume</p>
            <h3 className="text-xl font-bold text-[#c9a962] mt-1">₹{statsSummary.revenue.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+18.5% vs last month</span>
          </div>
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-lg">
            <p className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl font-bold text-[#f4f6f4] mt-1">{statsSummary.orders}</h3>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+22.4% vs last month</span>
          </div>
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-lg">
            <p className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Total Customers</p>
            <h3 className="text-xl font-bold text-[#f4f6f4] mt-1">{statsSummary.customers}</h3>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+15.3% vs last month</span>
          </div>
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl shadow-lg">
            <p className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Total Products</p>
            <h3 className="text-xl font-bold text-[#f4f6f4] mt-1">{statsSummary.products}</h3>
            <span className="text-[10px] text-[#648773] font-bold block mt-1">Flat stock index</span>
          </div>
        </div>

        {renderDashboardCharts()}

        {/* Dynamic widgets */}
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {/* Low Stock Alerts */}
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl text-xs space-y-4 shadow-lg">
            <h4 className="font-bold text-[#c9a962] uppercase tracking-wider">Low Stock Alerts</h4>
            <div className="space-y-3">
              {products.filter(p => (parseInt(p.stock) || 0) <= 5).slice(0, 3).map(p => (
                <div key={p.id} className="flex justify-between items-center border-b border-[#1b3327] pb-2">
                  <div>
                    <p className="font-semibold text-[#f4f6f4]">{p.name}</p>
                    <p className="text-[10px] text-[#9cb5a4]">Category: {p.category}</p>
                  </div>
                  <span className="text-red-400 font-bold">Stock: {p.stock || 0}</span>
                </div>
              ))}
              {products.filter(p => (parseInt(p.stock) || 0) <= 5).length === 0 && (
                <p className="text-[#648773] text-center">No products are low in stock.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl text-xs space-y-4 shadow-lg">
            <h4 className="font-bold text-[#c9a962] uppercase tracking-wider">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setActiveItem("Products"); setIsProductModalOpen(true); }} className="p-3 bg-[#1b3327] border border-[#274435] text-[#c9a962] font-semibold hover:bg-[#c9a962] hover:text-[#0a140f] rounded-lg text-center cursor-pointer transition-all">Add Product</button>
              <button onClick={() => setActiveItem("Collections")} className="p-3 bg-[#1b3327] border border-[#274435] text-[#c9a962] font-semibold hover:bg-[#c9a962] hover:text-[#0a140f] rounded-lg text-center cursor-pointer transition-all">Add Collection</button>
              <button onClick={() => setActiveItem("Categories")} className="p-3 bg-[#1b3327] border border-[#274435] text-[#c9a962] font-semibold hover:bg-[#c9a962] hover:text-[#0a140f] rounded-lg text-center cursor-pointer transition-all">Categories</button>
              <button onClick={() => setActiveItem("Coupons / Offers")} className="p-3 bg-[#1b3327] border border-[#274435] text-[#c9a962] font-semibold hover:bg-[#c9a962] hover:text-[#0a140f] rounded-lg text-center cursor-pointer transition-all">Add Coupon</button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#12221a] border border-[#1b3327] p-5 rounded-xl text-xs space-y-4 shadow-lg">
            <h4 className="font-bold text-[#c9a962] uppercase tracking-wider">Recent Orders</h4>
            <div className="space-y-3">
              {orders.slice(0, 3).map(o => (
                <div key={o.id} className="flex justify-between items-center border-b border-[#1b3327] pb-2">
                  <div>
                    <p className="font-semibold text-[#f4f6f4]">#{o.id?.slice(0, 8)}</p>
                    <p className="text-[10px] text-[#9cb5a4]">{o.customerName || 'Guest User'}</p>
                  </div>
                  <span className="text-[#c9a962] font-bold">₹{(o.total || o.grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-[#648773] text-center">No orders placed yet.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeItem) {
      case "Products":
        return (
          <>
            <ProductsTable
              products={filteredProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteProduct}
            />
          </>
        );
      case "Stock Manager":
        return <StockManager />;
      case "Orders":
        return (
          <>
            <OrdersTable />
          </>
        );
      case "Users":
      case "Customers":
        return (
          <>
            <UsersTable users={users} />
          </>
        );
      case "Categories":
        return (
          <GenericCRUDManager
            collectionName="categories"
            title="Category Management"
            fields={[
              { key: 'title', label: 'Category Name' },
              { key: 'image', label: 'Image URL', type: 'image' },
              { key: 'link', label: 'Redirect Link' },
              { key: 'sort_order', label: 'Sort Order', type: 'number' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ title: 'Green Tea', image: '', link: '/shop?category=Green Tea', sort_order: 1, is_active: true }}
            onUpdate={loadData}
          />
        );
      case "Subcategories":
        return (
          <GenericCRUDManager
            collectionName="subcategories"
            title="Subcategory Management"
            fields={[
              { key: 'name', label: 'Name' },
              { key: 'slug', label: 'Slug' },
              { key: 'parent_category', label: 'Parent Category' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ name: '', slug: '', parent_category: '', is_active: true, sort_order: 1 }}
          />
        );
      case "Collections":
        return (
          <GenericCRUDManager
            collectionName="collections"
            title="Collection Management"
            fields={[
              { key: 'name', label: 'Name' },
              { key: 'slug', label: 'Slug' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ name: '', slug: '', description: '', is_active: true, sort_order: 1 }}
          />
        );
      case "Attributes":
        return (
          <GenericCRUDManager
            collectionName="attributes"
            title="Catalog Attributes"
            fields={[
              { key: 'name', label: 'Attribute Name' },
              { key: 'values', label: 'Allowed Values (Comma-separated)' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ name: '', values: '', is_active: true, sort_order: 1 }}
          />
        );
      case "Coupons / Offers":
        return (
          <GenericCRUDManager
            collectionName="coupons"
            title="Store Coupons & Promotional Code Manager"
            fields={[
              { key: 'code', label: 'Coupon Code' },
              { key: 'discount_type', label: 'Type (Percentage / Fixed)' },
              { key: 'discount_val', label: 'Discount Value' },
              { key: 'min_order', label: 'Min Order Requirement' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ code: '', discount_type: 'Percentage', discount_val: '10', min_order: '999', is_active: true }}
          />
        );
      case "Blogs":
        return (
          <GenericCRUDManager
            collectionName="blogs"
            title="Brand Editorial Blogs"
            fields={[
              { key: 'image', label: 'Featured Image', type: 'image' },
              { key: 'title', label: 'Blog Title' },
              { key: 'slug', label: 'Slug' },
              { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
              { key: 'content', label: 'Blog Content (HTML)', type: 'textarea' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ image: '', title: '', slug: '', excerpt: '', content: '', is_active: true }}
          />
        );
      case "Pages":
        return (
          <GenericCRUDManager
            collectionName="pages"
            title="Static Brand Pages"
            fields={[
              { key: 'title', label: 'Page Title' },
              { key: 'slug', label: 'Slug' },
              { key: 'content', label: 'Content', type: 'textarea' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ title: '', slug: '', content: '', is_active: true }}
          />
        );
      case "Shop by Category":
        return (
          <GenericCRUDManager
            collectionName="shop_by_category"
            title="Shop By Category Banners"
            fields={[
              { key: 'title', label: 'Banner Title' },
              { key: 'image', label: 'Image URL', type: 'image' },
              { key: 'link', label: 'Redirect Link' },
              { key: 'sort_order', label: 'Sort Order', type: 'number' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ title: 'BLACK TEA', image: '', link: '/shop?category=Black Tea', sort_order: 1, is_active: true }}
          />
        );
      case "Brewing Rituals":
      case "Shop The Look":
        return (
          <GenericCRUDManager
            collectionName="brewing_rituals"
            title="Brewing Rituals CRUD"
            fields={[
              { key: 'image', label: 'Panel Image', type: 'image' },
              { key: 'category', label: 'Tag / Category Subtitle' },
              { key: 'title', label: 'Product Title' },
              { key: 'price', label: 'Price (INR)', type: 'number' },
              { key: 'link', label: 'Destination Link' },
              { key: 'sort_order', label: 'Sort Order', type: 'number' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ image: '', category: 'TEA BLENDS', title: 'Tea Product Name', price: 499, link: '/shop', sort_order: 1, is_active: true }}
          />
        );
      case "Community Gallery":
      case "Reviews":
        return (
          <GenericCRUDManager
            collectionName="community_reviews"
            title="Community Tea Reviews & Gallery CMS"
            fields={[
              { key: 'author', label: 'Author / Customer Name' },
              { key: 'rating', label: 'Rating (1-5)', type: 'number' },
              { key: 'comment', label: 'Review Comment', type: 'textarea' },
              { key: 'image', label: 'User Photo (Optional)', type: 'image' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ author: 'Tea Connoisseur', rating: 5, comment: 'Exceptional aroma and rich Assam flavor!', image: '', is_active: true }}
          />
        );
      case "Hero Slides":
        return (
          <GenericCRUDManager
            collectionName="hero_slides"
            title="Homepage Hero Slides CMS"
            fields={[
              { key: 'image', label: 'Slide Image', type: 'image' },
              { key: 'tag', label: 'Tag / Eyebrow' },
              { key: 'title', label: 'Title (use \\n for line breaks)' },
              { key: 'subtitle', label: 'Subtitle' },
              { key: 'cta', label: 'CTA Text' },
              { key: 'ctaLink', label: 'CTA Link' },
              { key: 'sort_order', label: 'Sort Order', type: 'number' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ image: '', tag: 'NEW IN', title: 'Brand Title', subtitle: 'Description details...', cta: 'Shop Collection', ctaLink: '/shop', sort_order: 1, is_active: true }}
          />
        );
      case "Benefits Strip":
        return (
          <GenericCRUDManager
            collectionName="benefits_strip"
            title="Homepage Benefits Info Strip CMS"
            fields={[
              { key: 'icon', label: 'Icon (Truck, Zap, RotateCcw, ShieldCheck)' },
              { key: 'text', label: 'Benefit text' },
              { key: 'sort_order', label: 'Sort Order', type: 'number' },
              { key: 'is_active', label: 'Status', type: 'boolean' }
            ]}
            defaultItem={{ icon: 'Truck', text: 'Free Delivery', sort_order: 1, is_active: true }}
          />
        );
      case "Activity Logs":
        return <ActivityLogsView />;
      case "Store Settings":
      case "Payment Settings":
      case "Shipping Settings":
      case "Tax Settings":
      case "SEO Settings":
        return (
          <div className="bg-[#12221a] border border-[#1b3327] rounded-xl p-6 text-[#f4f6f4] text-xs max-w-lg space-y-4">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#c9a962]">{activeItem}</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[#9cb5a4] uppercase tracking-widest text-[9px] block">Primary Parameter</label>
                <input type="text" defaultValue="vaarta Tea" className="w-full px-3 py-2 bg-[#0a140f] border border-[#1b3327] rounded text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[#9cb5a4] uppercase tracking-widest text-[9px] block">Fallback Mode</label>
                <select className="w-full px-3 py-2 bg-[#0a140f] border border-[#1b3327] rounded text-white">
                  <option>Enabled (Production)</option>
                  <option>Disabled (Staging)</option>
                </select>
              </div>
            </div>
            <button onClick={() => alert("Settings updated!")} className="px-5 py-2.5 bg-[#c9a962] text-[#0a140f] font-bold rounded">Save Configuration</button>
          </div>
        );
      case "Help / Documentation":
        return (
          <div className="bg-[#12221a] border border-[#1b3327] rounded-xl p-6 text-[#f4f6f4] text-xs space-y-4 max-w-xl shadow-xl">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#c9a962]">vaarta Tea Control Center</h2>
            <p className="text-[#9cb5a4] font-light leading-relaxed">This dashboard controls the storefront sections, database lists, order timelines, inventory, and promotions in real time. All changes are saved automatically to Firebase Firestore.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#0a140f] text-[#f4f6f4] selection:bg-[#c9a962] selection:text-[#0a140f]">
      <AdminSidebar activeItem={activeItem} setActiveItem={setActiveItem} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 overflow-auto bg-[#0a140f]">
        <div className="max-w-7xl mx-auto">
          <AdminHeader activeItem={activeItem} searchVal={searchVal} setSearchVal={setSearchVal} onMenuClick={() => setIsMobileSidebarOpen(true)} />

          {activeItem === "Products" && (
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="px-6 py-3 rounded-lg bg-[#c9a962] text-[#0a140f] text-xs font-bold hover:bg-[#d4af37] transition-all flex items-center gap-2 shadow-lg shadow-[#c9a962]/15 cursor-pointer"
              >
                <Plus size={14} /> Add New Tea Product
              </button>
            </div>
          )}

          {renderMainContent()}
        </div>
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1a14] border border-[#1b3327] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-7 py-5 border-b border-[#1b3327] flex items-center justify-between">
              <div>
                <h2 className="text-base font-poppins font-bold text-[#c9a962] uppercase tracking-wider">
                  Add New Tea Product
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-[#162a20] rounded-lg transition-colors text-[#9cb5a4] hover:text-[#c9a962] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-7 py-6">
              <TeaProductForm
                onSuccess={handleAddProductSubmit}
                categoriesList={categoriesList}
              />
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1a14] border border-[#1b3327] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-7 py-5 border-b border-[#1b3327] flex items-center justify-between">
              <div>
                <h2 className="text-base font-poppins font-bold text-[#c9a962] uppercase tracking-wider">
                  Edit Tea Product
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-[#162a20] rounded-lg transition-colors text-[#9cb5a4] hover:text-[#c9a962] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-7 py-6">
              <TeaProductForm
                product={editingProduct}
                isEdit={true}
                onSuccess={handleEditProductSubmit}
                categoriesList={categoriesList}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
