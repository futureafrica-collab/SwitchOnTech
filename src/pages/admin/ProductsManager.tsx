import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, categories } from "@/data/products";
import { Plus, Search, Pencil, Trash2, Loader2, X, Upload } from "lucide-react";

interface DBProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  specs: string | null;
  price: number;
  stock_count: number | null;
  stock_status: string | null;
  images: string[] | null;
  featured: boolean | null;
  created_at: string | null;
}

const stockStatuses = ["In Stock", "Limited Stock", "Out of Stock", "Build to Order"];
const cats = categories.filter((c) => c !== "All");

const ProductsManager = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DBProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "", category: "Laptops", description: "", specs: "",
    price: "", stock_count: "0", stock_status: "In Stock", featured: false,
    images: [] as string[],
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as DBProduct[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", category: "Laptops", description: "", specs: "", price: "", stock_count: "0", stock_status: "In Stock", featured: false, images: [] });
    setImageFiles([]);
    setModalOpen(true);
  };

  const openEdit = (p: DBProduct) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, description: p.description || "",
      specs: p.specs || "", price: String(p.price), stock_count: String(p.stock_count || 0),
      stock_status: p.stock_status || "In Stock", featured: p.featured || false,
      images: p.images || [],
    });
    setImageFiles([]);
    setModalOpen(true);
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [...form.images];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast({ title: "Missing fields", description: "Name and price are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const images = await uploadImages();
    const payload = {
      name: form.name.trim(), category: form.category, description: form.description.trim() || null,
      specs: form.specs.trim() || null, price: Number(form.price), stock_count: Number(form.stock_count),
      stock_status: form.stock_status, featured: form.featured, images,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product saved successfully" });
    setModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDeleting(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const filtered = products
    .filter((p) => catFilter === "All" || p.category === catFilter)
    .filter((p) => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()));

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={`${inputClass} pl-9`} />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="All">All Categories</option>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-accent" size={28} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Featured</th>
                <th className="p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3">
                      <img src={p.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&q=60"} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    </td>
                    <td className="p-3 text-foreground font-medium max-w-[200px] truncate">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.category}</td>
                    <td className="p-3 text-foreground font-medium">{formatPrice(Number(p.price))}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock_status === "In Stock" ? "bg-green-100 text-green-800" : p.stock_status === "Limited Stock" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}>{p.stock_status}</span></td>
                    <td className="p-3">{p.featured ? "⭐" : "—"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10"><Pencil size={15} /></button>
                        <button onClick={() => { if (confirm("Delete this product?")) handleDelete(p.id); }} disabled={deleting === p.id} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          {deleting === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg my-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">{editing ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputClass}>
                  {cats.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputClass} min-h-[80px]`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Specs</label>
                <textarea value={form.specs} onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))} className={`${inputClass} min-h-[60px]`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price (₦) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputClass} required min={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Stock Count</label>
                  <input type="number" value={form.stock_count} onChange={(e) => setForm((f) => ({ ...f, stock_count: e.target.value }))} className={inputClass} min={0} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Stock Status</label>
                <select value={form.stock_status} onChange={(e) => setForm((f) => ({ ...f, stock_status: e.target.value }))} className={inputClass}>
                  {stockStatuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} id="featured" className="accent-accent" />
                <label htmlFor="featured" className="text-sm text-foreground">Featured Product</label>
              </div>
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
                {form.images.length + imageFiles.length < 4 && (
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground cursor-pointer hover:border-accent">
                    <Upload size={16} /> Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files?.[0]) setImageFiles((prev) => [...prev, e.target.files![0]]);
                    }} />
                  </label>
                )}
                {imageFiles.length > 0 && <p className="text-xs text-muted-foreground mt-1">{imageFiles.length} new file(s) to upload</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] disabled:opacity-60">
                  {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
