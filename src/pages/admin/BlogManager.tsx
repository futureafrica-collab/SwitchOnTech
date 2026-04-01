import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  category: string | null;
  author: string | null;
  published: boolean | null;
  featured_image: string | null;
  excerpt: string | null;
  read_time: string | null;
  created_at: string | null;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  if (editing || isNew) {
    return <BlogEditor post={editing} onDone={() => { setEditing(null); setIsNew(false); fetchPosts(); }} />;
  }

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: post.published ? "Post unpublished" : "Post published" });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Post deleted" });
    fetchPosts();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Blog Posts</h2>
        <button onClick={() => setIsNew(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">
          <Plus size={16} /> Write New Post
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-accent" size={28} /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No blog posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-medium max-w-[250px] truncate">{p.title}</td>
                    <td className="p-3 text-muted-foreground">{p.category || "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10"><Pencil size={15} /></button>
                        <button onClick={() => togglePublish(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10">
                          {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Blog Editor sub-component
const BlogEditor = ({ post, onDone }: { post: BlogPost | null; onDone: () => void }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: post?.title || "",
    category: post?.category || "",
    featured_image: post?.featured_image || "",
    excerpt: post?.excerpt || "",
    read_time: post?.read_time || "",
    content: post?.content || "",
    published: post?.published || false,
  });

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm((f) => ({ ...f, featured_image: urlData.publicUrl }));
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  const handleSave = async (publish?: boolean) => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title),
      category: form.category || null,
      featured_image: form.featured_image || null,
      excerpt: form.excerpt || null,
      read_time: form.read_time || null,
      content: form.content || null,
      published: publish !== undefined ? publish : form.published,
    };

    let error;
    if (post) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", post.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: publish ? "Post published!" : "Post saved!" });
    onDone();
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="space-y-4">
      <button onClick={onDone} className="text-sm text-accent hover:underline">← Back to posts</button>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Post Title" className="w-full text-2xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Slug: {slugify(form.title) || "—"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
            <Select value={form.category} onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["Tech Tips", "Reviews", "Tutorials", "News", "How-To Guides"].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Read Time</label>
            <Select value={form.read_time} onValueChange={(val) => setForm((f) => ({ ...f, read_time: val }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select read time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 3).map((min) => (
                  <SelectItem key={min} value={`${min} min read`}>{min} min read</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Featured Image</label>
            <div className="flex items-center gap-2">
              <label className={`flex-1 cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 py-2.5 text-sm text-muted-foreground hover:border-accent/50 transition-colors text-center ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={14} /> Uploading...</span>
                ) : form.featured_image ? (
                  "Change Image"
                ) : (
                  "Upload Image"
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {form.featured_image && (
              <div className="mt-2 relative">
                <img src={form.featured_image} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-border" />
                <button onClick={() => setForm((f) => ({ ...f, featured_image: "" }))} className="absolute top-1 right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:opacity-80">×</button>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className={`${inputClass} min-h-[60px]`} placeholder="Brief description..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
          <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className={`${inputClass} min-h-[250px]`} placeholder="Write your post content here..." />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} id="pub" className="accent-accent" />
          <label htmlFor="pub" className="text-sm text-foreground">Published</label>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSave(false)} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted">Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] disabled:opacity-60">
            {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
