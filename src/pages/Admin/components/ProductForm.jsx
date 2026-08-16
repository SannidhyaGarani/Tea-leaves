import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Layers,
  Zap,
  Tag,
  Star,
  Check,
  Flame,
  Info
} from "lucide-react";

const TeaProductForm = ({ onSuccess, isEdit = false, product = null, categoriesList = [] }) => {
  // Initialize size_prices from existing product or default with empty array
  const initialSizePrices = product?.size_prices || [];
  const [sizePrices, setSizePrices] = useState(
    initialSizePrices.length > 0 ? initialSizePrices : [{ size: "250g", price: 499, original_price: 649, stock: 25 }]
  );

  const getInitialImages = () => {
    if (product) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images.map(url => ({ type: 'existing', url }));
      } else if (product.image) {
        return [{ type: 'existing', url: product.image }];
      }
    }
    return [];
  };

  const [imagePreviews, setImagePreviews] = useState(getInitialImages());
  const [primaryIndex, setPrimaryIndex] = useState(0);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "Black Tea",
      caffeine: product?.caffeine || "",
      description: product?.description || "",
      price: product?.price || 499,
      original_price: product?.original_price || 649,
      stock: product?.stock ?? 25,
      stock_status: product?.stock_status || "In Stock",
      flavors: product?.flavors || "",
      ingredients: product?.ingredients || "",
      rating: product?.rating || 4.8,
    },
  });

  const stockValue = watch("stock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");

  useEffect(() => {
    if (product) {
      const initialImgs = [];
      if (Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach(url => initialImgs.push({ type: 'existing', url }));
      } else if (product.image) {
        initialImgs.push({ type: 'existing', url: product.image });
      }
      setImagePreviews(initialImgs);
      setPrimaryIndex(0);
      setSizePrices(product.size_prices && product.size_prices.length > 0 ? product.size_prices : [{ size: "250g", price: 499, original_price: 649 }]);
      reset({
        name: product.name || "",
        category: product.category || "Black Tea",
        caffeine: product.caffeine || "",
        description: product.description || "",
        price: product.price || 499,
        original_price: product.original_price || 649,
        stock: product.stock ?? 25,
        stock_status: product.stock_status || "In Stock",
        flavors: product.flavors || "",
        ingredients: product.ingredients || "",
        rating: product.rating || 4.8,
      });
    } else {
      setImagePreviews([]);
      setPrimaryIndex(0);
      setSizePrices([{ size: "250g", price: 499, original_price: 649, stock: 25 }]);
      reset({
        name: "",
        category: "Black Tea",
        caffeine: "",
        description: "",
        price: 499,
        original_price: 649,
        stock: 25,
        stock_status: "In Stock",
        flavors: "",
        ingredients: "100% Assam Single Origin Tea Leaves",
        rating: 4.8,
      });
    }
  }, [product, reset]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => ({
      type: 'new',
      url: URL.createObjectURL(file),
      file
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleModelImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImageFile(file);
      setModelImagePreview(URL.createObjectURL(file));
    }
  };

  const removeModelImage = () => {
    setModelImageFile(null);
    setModelImagePreview(null);
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (primaryIndex >= updated.length) {
        setPrimaryIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const selectPrimary = (idx) => {
    setPrimaryIndex(idx);
  };

  const addSizePrice = () => {
    setSizePrices(prev => [...prev, { size: "", price: 0, original_price: 0, stock: 0 }]);
  };

  const updateSizePrice = (index, field, value) => {
    setSizePrices(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeSizePrice = (index) => {
    setSizePrices(prev => prev.filter((_, idx) => idx !== index));
  };

  const DEFAULT_CATEGORIES = [
    "Black Tea",
    "Green Tea",
    "Oolong Tea",
    "White Tea",
    "Herbal Tea",
    "Chai Spices",
    "Teaware & Accessories"
  ];

  const parsedCategories = Array.isArray(categoriesList)
    ? categoriesList.map(c => typeof c === 'string' ? c : c.title || c.name).filter(Boolean)
    : [];

  const activeCategories = Array.from(
    new Set([
      ...parsedCategories,
      ...DEFAULT_CATEGORIES
    ])
  );

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    setUploadProgressMsg("Uploading media to Cloudinary...");
    try {
      const uploadUrls = [];
      for (const item of imagePreviews) {
        if (item.type === 'existing') {
          uploadUrls.push(item.url);
        } else if (item.type === 'new' && item.file) {
          const url = await uploadToCloudinary(item.file, "products");
          uploadUrls.push(url);
        }
      }

      let orderedUrls = [...uploadUrls];
      if (uploadUrls.length > 0) {
        const primaryUrl = uploadUrls[primaryIndex] || uploadUrls[0];
        const remainingUrls = uploadUrls.filter((_, idx) => idx !== primaryIndex);
        orderedUrls = [primaryUrl, ...remainingUrls];
      }

      const validSizePrices = sizePrices.filter(sp => sp.size.trim() !== "");
      
      const defaultPrice = validSizePrices.length > 0 ? validSizePrices[0].price : Number(values.price) || 0;
      const defaultOriginalPrice = validSizePrices.length > 0 ? validSizePrices[0].original_price : Number(values.original_price) || 0;

      // Derive top-level stock from sum of all variant stocks (for backward compat)
      const totalStock = validSizePrices.length > 0
        ? validSizePrices.reduce((sum, sp) => sum + (Number(sp.stock) || 0), 0)
        : 0;
      const firstVariantStock = validSizePrices.length > 0 ? (Number(validSizePrices[0].stock) || 0) : 0;
      const autoStatus = totalStock === 0 ? "Out of Stock" : firstVariantStock <= 5 ? "Low Stock" : "In Stock";

      const docData = {
        name: values.name,
        category: values.category,
        caffeine: values.caffeine || "",
        description: values.description,
        price: defaultPrice,
        original_price: defaultOriginalPrice,
        size_prices: validSizePrices.map(sp => ({ ...sp, stock: Number(sp.stock) || 0 })),
        stock: totalStock,
        stock_status: autoStatus,
        sizes: validSizePrices.map(sp => sp.size).join(", "),
        flavors: values.flavors || "",
        ingredients: values.ingredients || "",
        rating: Number(values.rating) || 4.8,
        images: orderedUrls,
        image: orderedUrls[0] || "",
      };

      if (onSuccess) {
        onSuccess(docData);
      }
      reset();
      setImagePreviews([]);
      setPrimaryIndex(0);
      setModelImagePreview(null);
      setModelImageFile(null);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgressMsg("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 bg-[#0a140f] p-6 sm:p-8 rounded-3xl border border-[#1b3327] shadow-2xl text-[#f4f6f4]">
      {/* Form Header Banner */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1b3327]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#162a20] border border-[#c9a962]/40 text-[#c9a962] flex items-center justify-center shadow-lg">
            <Leaf size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif">
              {isEdit ? "Edit Tea Product Details" : "Add New Tea"}
            </h3>
           
          </div>
        </div>
       
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* SECTION 1: ESSENTIAL DETAILS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9a962]">
          <Tag size={14} /> <span>1. Basic Specifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
              Tea Product Name <span className="text-[#c9a962]">*</span>
            </label>
            <input
              className="w-full px-4 py-3.5 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] focus:ring-1 focus:ring-[#c9a962] outline-none transition-all text-xs font-medium text-white placeholder-[#648773] shadow-inner"
              placeholder="e.g. Assam Royal Malty CTC Chai"
              {...register("name", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
              Category <span className="text-[#c9a962]">*</span>
            </label>
            <select
              className="w-full px-4 py-3.5 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] focus:ring-1 focus:ring-[#c9a962] outline-none transition-all text-xs font-semibold text-white shadow-inner"
              {...register("category", { required: true })}
            >
              {activeCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a140f] text-white py-2">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
              Caffeine Strength
            </label>
            <select
              className="w-full px-4 py-3.5 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] focus:ring-1 focus:ring-[#c9a962] outline-none transition-all text-xs font-semibold text-white shadow-inner"
              {...register("caffeine")}
            >
              <option value="" className="bg-[#0a140f]">-- None / Optional --</option>
              <option value="High Caffeine" className="bg-[#0a140f]">⚡ High Caffeine (Chai Boost)</option>
              <option value="Medium Caffeine" className="bg-[#0a140f]">🌿 Medium Caffeine (Daily Brew)</option>
              <option value="Low Caffeine" className="bg-[#0a140f]">🍃 Low Caffeine (Smooth Evening)</option>
              <option value="Caffeine-Free" className="bg-[#0a140f]">🌸 Caffeine-Free (Herbal Infusion)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
            Description & Tasting Notes
          </label>
          <textarea
            className="w-full px-4 py-3.5 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] focus:ring-1 focus:ring-[#c9a962] outline-none transition-all text-xs text-white placeholder-[#648773] min-h-[90px] leading-relaxed shadow-inner"
            placeholder="Detail the handpicked origin, leaf aroma, flavor notes (e.g. malty, spicy), and recommended milk/water brewing instructions..."
            rows={3}
            {...register("description")}
          />
        </div>
      </div>

      {/* SECTION 2: WEIGHT VARIANTS & PRICING */}
      <div className="space-y-4 pt-4 border-t border-[#1b3327]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9a962]">
            <Layers size={14} /> <span>2. Weight Variants & Pricing</span>
          </div>
          <button
            type="button"
            onClick={addSizePrice}
            className="px-3.5 py-1.5 bg-[#162a20] border border-[#c9a962]/40 text-[#c9a962] text-xs font-bold rounded-lg hover:bg-[#c9a962] hover:text-[#0a140f] transition-all flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Plus size={14} /> Add Weight Variant
          </button>
        </div>

        <div className="space-y-3">
          {sizePrices.map((sp, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end bg-[#12221a] border border-[#1b3327] p-4 rounded-2xl shadow-md relative group hover:border-[#c9a962]/30 transition-all">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Pack Weight</label>
                <input
                  type="text"
                  value={sp.size}
                  onChange={(e) => updateSizePrice(index, "size", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#1b3327] bg-[#0a140f] focus:border-[#c9a962] outline-none text-xs text-white placeholder-[#648773]"
                  placeholder="e.g. 250g"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9cb5a4] uppercase tracking-wider">Original Price (₹)</label>
                <input
                  type="number"
                  value={sp.original_price}
                  onChange={(e) => updateSizePrice(index, "original_price", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#1b3327] bg-[#0a140f] focus:border-[#c9a962] outline-none text-xs text-white"
                  placeholder="649"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#c9a962] uppercase tracking-wider">Selling Price (₹)</label>
                <input
                  type="number"
                  value={sp.price}
                  onChange={(e) => updateSizePrice(index, "price", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#c9a962]/50 bg-[#0a140f] focus:border-[#c9a962] outline-none text-xs font-bold text-[#c9a962]"
                  placeholder="499"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Stock (Units)</label>
                <input
                  type="number"
                  min="0"
                  value={sp.stock ?? 0}
                  onChange={(e) => updateSizePrice(index, "stock", Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-emerald-800/50 bg-[#0a140f] focus:border-emerald-400 outline-none text-xs font-bold text-emerald-300"
                  placeholder="25"
                />
                <span className={`text-[9px] font-bold uppercase block mt-0.5 ${
                  (Number(sp.stock) || 0) === 0 ? 'text-red-400' :
                  (Number(sp.stock) || 0) <= 5 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(Number(sp.stock) || 0) === 0 ? '● Out of Stock' : (Number(sp.stock) || 0) <= 5 ? '● Low Stock' : '● In Stock'}
                </span>
              </div>

              <div className="flex items-start pt-5">
                {sizePrices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizePrice(index)}
                    className="w-full py-2.5 bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-bold rounded-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: INVENTORY, FLAVORS & RATING */}
      <div className="space-y-4 pt-4 border-t border-[#1b3327]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9a962]">
          <Zap size={14} /> <span>3. Inventory & Attribute Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
              Flavor Notes
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] outline-none text-xs text-white placeholder-[#648773]"
              placeholder="e.g. Malty, Earthy, Cardamom"
              {...register("flavors")}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
              Star Rating (0 to 5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-3 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] outline-none text-xs text-white font-bold"
              placeholder="4.8"
              {...register("rating")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#9cb5a4] uppercase tracking-wider block">
            Ingredients & Tea Estate Origin
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-[#1b3327] bg-[#12221a] focus:border-[#c9a962] outline-none text-xs text-white placeholder-[#648773]"
            placeholder="e.g. 100% Handpicked Single Origin Assam Whole Leaf Tea, Fresh Cardamom Pods"
            {...register("ingredients")}
          />
        </div>
      </div>

      {/* SECTION 4: HIGH-VISIBILITY MEDIA UPLOAD ZONE */}
      <div className="space-y-4 pt-4 border-t border-[#1b3327]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9a962]">
            <ImageIcon size={14} /> <span>4. Product Media Upload</span>
          </div>
          <span className="text-[10px] text-[#9cb5a4] font-medium">High Resolution PNG / JPG / WebP</span>
        </div>

        {/* Primary Images Dropzone */}
        <div className="relative border-2 border-dashed border-[#1b3327] hover:border-[#c9a962] bg-[#12221a] p-6 rounded-2xl text-center transition-all group">
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none z-10">
            <div className="w-12 h-12 rounded-full bg-[#162a20] border border-[#c9a962]/40 text-[#c9a962] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                <span className="text-[#c9a962]">Click to upload</span> or drag and drop tea images
              </p>
              <p className="text-[10px] text-[#648773] mt-0.5">
                Automatically saved to Cloudinary folder: <code className="text-[#c9a962]">vaarta_chai/products</code>
              </p>
            </div>
          </div>
        </div>

        {/* Selected Images Grid */}
        {imagePreviews.length > 0 && (
          <div className="space-y-2 bg-[#12221a] p-4 rounded-2xl border border-[#1b3327]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9a962]">
                Uploaded Images ({imagePreviews.length}) — Click thumbnail to select Primary Display
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {imagePreviews.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => selectPrimary(idx)}
                  className={`relative group aspect-square rounded-xl border-2 overflow-hidden bg-[#0a140f] cursor-pointer transition-all ${
                    primaryIndex === idx ? 'border-[#c9a962] ring-2 ring-[#c9a962]/40 shadow-lg' : 'border-[#1b3327] hover:border-[#648773]'
                  }`}
                >
                  <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(idx);
                    }}
                    className="absolute top-1.5 right-1.5 z-30 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs shadow transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                    title="Remove Image"
                  >
                    <Trash2 size={12} />
                  </button>

                  {primaryIndex === idx && (
                    <span className="absolute bottom-1.5 left-1.5 bg-[#c9a962] text-[#0a140f] text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FORM FOOTER & SUBMIT */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-[#1b3327]">
        <div className="text-xs text-[#9cb5a4]">
          {loading && (
            <span className="flex items-center gap-2 text-[#c9a962] font-bold animate-pulse">
              <UploadCloud size={16} /> {uploadProgressMsg || "Processing upload..."}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#c9a962] text-[#0a140f] text-xs font-bold uppercase tracking-widest hover:bg-[#d9b871] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#0a140f] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 size={16} />
              {isEdit ? "Save Product Changes" : "Publish Tea Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TeaProductForm;
