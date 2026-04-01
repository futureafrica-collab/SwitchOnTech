-- =========================================================
-- COMPLETE SUPABASE SETUP SCRIPT FOR SWITCHON TECH
-- Run this in your Supabase SQL Editor for the NEW project
-- =========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  address text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Anyone can insert profile" ON public.profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 2. PRODUCTS TABLE
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  specs text,
  price numeric NOT NULL,
  stock_count integer DEFAULT 0,
  stock_status text DEFAULT 'In Stock',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.products FOR ALL TO authenticated USING (true);

-- 3. ORDERS TABLE
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  delivery_address text,
  city text,
  state text,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  paystack_reference text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can delete orders" ON public.orders FOR DELETE TO authenticated USING (true);

-- 4. REPAIR REQUESTS
CREATE TABLE public.repair_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  device_type text NOT NULL,
  device_model text,
  issue_description text NOT NULL,
  urgency text DEFAULT 'normal',
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create repair requests" ON public.repair_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users can view own repairs" ON public.repair_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 5. CONTACT MESSAGES
CREATE TABLE public.contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 6. BLOG POSTS
CREATE TABLE public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  category text,
  author text DEFAULT 'Switchon Tech',
  published boolean DEFAULT false,
  featured_image text,
  excerpt text,
  read_time text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true);

-- 7. NEWSLETTER
CREATE TABLE public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- =========================================================
-- SEED DATA: PRODUCTS
-- =========================================================

INSERT INTO public.products (name, category, specs, price, images, stock_status, description, slug)
VALUES
  ('HP Laptop 15 Core i5', 'Laptops', '8GB RAM | 512GB SSD | Win 11', 485000, '{"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'The HP Laptop 15 with Intel Core i5 processor delivers reliable performance for everyday computing.', 'hp-laptop-15-i5'),
  ('Dell Inspiron 15 Core i7', 'Laptops', '16GB RAM | 1TB SSD | Win 11', 720000, '{"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Power through demanding workloads with the Dell Inspiron 15 featuring an Intel Core i7 processor.', 'dell-inspiron-15-i7'),
  ('Lenovo ThinkPad X1 Carbon', 'Laptops', '16GB RAM | 512GB SSD | Win 11', 950000, '{"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"}', 'Limited Stock', 'The legendary ThinkPad X1 Carbon combines ultralight portability with enterprise-grade durability.', 'lenovo-thinkpad-x1'),
  ('MacBook Air M2', 'Laptops', '8GB RAM | 256GB SSD | macOS', 1150000, '{"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Apple''s M2 chip delivers incredible performance and all-day battery life.', 'macbook-air-m2'),
  ('HP Desktop Core i5 Tower', 'Desktops', '8GB RAM | 1TB HDD | Win 11', 320000, '{"https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'A reliable desktop solution for office and home use.', 'hp-desktop-i5-tower'),
  ('Custom Gaming Desktop i7', 'Desktops', '16GB RAM | 1TB SSD | RTX 3060', 850000, '{"https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80"}', 'Build to Order', 'Built to your exact specifications, this custom gaming desktop features an Intel Core i7 processor.', 'custom-gaming-desktop-i7'),
  ('HP LaserJet Pro M404n', 'Printers', 'Print only | USB & Network', 185000, '{"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Fast, reliable monochrome laser printing for busy offices.', 'hp-laserjet-pro-m404n'),
  ('Canon PIXMA G3420', 'Printers', 'Print, Scan, Copy | WiFi', 95000, '{"https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'The Canon PIXMA G3420 ink tank printer offers ultra-low running costs.', 'canon-pixma-g3420'),
  ('Wireless Keyboard & Mouse Combo', 'Accessories', '2.4GHz | Long battery life', 12500, '{"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'A comfortable wireless keyboard and mouse set.', 'wireless-keyboard-mouse-combo'),
  ('15.6 inch Laptop Bag', 'Accessories', 'Waterproof | Multiple pockets', 8500, '{"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Protect your laptop in style with this durable bag.', 'laptop-bag-15-6'),
  ('TP-Link WiFi 6 Router', 'Networking', 'AX1800 | Dual Band | 4 ports', 45000, '{"https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Upgrade your home or office network with WiFi 6 technology.', 'tp-link-wifi-6-router'),
  ('Cisco 8-Port Network Switch', 'Networking', 'Gigabit | Plug and Play', 28000, '{"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"}', 'In Stock', 'Expand your network with this reliable Cisco 8-port Gigabit switch.', 'cisco-8-port-switch');
