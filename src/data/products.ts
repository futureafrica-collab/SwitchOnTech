export interface Product {
  id?: string; // UUID from Supabase
  slug: string; // Friendly URL identifier
  name: string;
  category: string;
  specs: string;
  price: number;
  image: string;
  badge: string;
  description: string;
}

export const products: Product[] = [
  {
    slug: "hp-laptop-15-i5",
    name: "HP Laptop 15 Core i5",
    category: "Laptops",
    specs: "8GB RAM | 512GB SSD | Win 11",
    price: 485000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "The HP Laptop 15 with Intel Core i5 processor delivers reliable performance for everyday computing. With 8GB RAM and a fast 512GB SSD, it handles multitasking smoothly. Comes pre-installed with Windows 11 and features a 15.6-inch Full HD display for crisp visuals.",
  },
  {
    slug: "dell-inspiron-15-i7",
    name: "Dell Inspiron 15 Core i7",
    category: "Laptops",
    specs: "16GB RAM | 1TB SSD | Win 11",
    price: 720000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Power through demanding workloads with the Dell Inspiron 15 featuring an Intel Core i7 processor, 16GB RAM, and a spacious 1TB SSD. Perfect for professionals and students who need extra performance. Windows 11 Pro included.",
  },
  {
    slug: "lenovo-thinkpad-x1",
    name: "Lenovo ThinkPad X1 Carbon",
    category: "Laptops",
    specs: "16GB RAM | 512GB SSD | Win 11",
    price: 950000,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    badge: "Limited Stock",
    description: "The legendary ThinkPad X1 Carbon combines ultralight portability with enterprise-grade durability. Featuring a stunning 14-inch display, 16GB RAM, 512GB SSD, and the iconic ThinkPad keyboard. Built for professionals who demand the best.",
  },
  {
    slug: "macbook-air-m2",
    name: "MacBook Air M2",
    category: "Laptops",
    specs: "8GB RAM | 256GB SSD | macOS",
    price: 1150000,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Apple's M2 chip delivers incredible performance and all-day battery life in the thinnest, lightest MacBook Air ever. With a stunning Liquid Retina display, MagSafe charging, and silent fanless design, it's the perfect laptop for creative professionals.",
  },
  {
    slug: "hp-desktop-i5-tower",
    name: "HP Desktop Core i5 Tower",
    category: "Desktops",
    specs: "8GB RAM | 1TB HDD | Win 11",
    price: 320000,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "A reliable desktop solution for office and home use. The HP Desktop Tower features an Intel Core i5 processor, 8GB RAM, and 1TB HDD for ample storage. Easy to upgrade and maintain, with multiple USB ports and expansion slots.",
  },
  {
    slug: "custom-gaming-desktop-i7",
    name: "Custom Gaming Desktop i7",
    category: "Desktops",
    specs: "16GB RAM | 1TB SSD | RTX 3060",
    price: 850000,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
    badge: "Build to Order",
    description: "Built to your exact specifications, this custom gaming desktop features an Intel Core i7 processor, 16GB DDR5 RAM, 1TB NVMe SSD, and an NVIDIA RTX 3060 graphics card. Includes RGB lighting, premium cooling, and a tempered glass case.",
  },
  {
    slug: "hp-laserjet-pro-m404n",
    name: "HP LaserJet Pro M404n",
    category: "Printers",
    specs: "Print only | USB & Network",
    price: 185000,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Fast, reliable monochrome laser printing for busy offices. The HP LaserJet Pro M404n prints up to 40 pages per minute with sharp, professional quality. Features USB and Ethernet connectivity for easy network sharing.",
  },
  {
    slug: "canon-pixma-g3420",
    name: "Canon PIXMA G3420",
    category: "Printers",
    specs: "Print, Scan, Copy | WiFi",
    price: 95000,
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "The Canon PIXMA G3420 ink tank printer offers ultra-low running costs with high-yield ink bottles. Print, scan, and copy wirelessly via WiFi. Perfect for home and small office use with vibrant colour output.",
  },
  {
    slug: "wireless-keyboard-mouse-combo",
    name: "Wireless Keyboard & Mouse Combo",
    category: "Accessories",
    specs: "2.4GHz | Long battery life",
    price: 12500,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "A comfortable wireless keyboard and mouse set with reliable 2.4GHz connectivity. Features a full-size keyboard with quiet keys and an ergonomic mouse. Long battery life means fewer interruptions to your workflow.",
  },
  {
    slug: "laptop-bag-15-6",
    name: '15.6 inch Laptop Bag',
    category: "Accessories",
    specs: "Waterproof | Multiple pockets",
    price: 8500,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Protect your laptop in style with this durable 15.6-inch laptop bag. Features waterproof material, padded compartment, multiple organiser pockets, and comfortable shoulder straps. Available in black and grey.",
  },
  {
    slug: "tp-link-wifi-6-router",
    name: "TP-Link WiFi 6 Router",
    category: "Networking",
    specs: "AX1800 | Dual Band | 4 ports",
    price: 45000,
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Upgrade your home or office network with WiFi 6 technology. The TP-Link AX1800 delivers faster speeds, greater capacity, and reduced latency. Features dual-band connectivity, 4 Gigabit LAN ports, and easy app-based setup.",
  },
  {
    slug: "cisco-8-port-switch",
    name: "Cisco 8-Port Network Switch",
    category: "Networking",
    specs: "Gigabit | Plug and Play",
    price: 28000,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    badge: "In Stock",
    description: "Expand your network with this reliable Cisco 8-port Gigabit switch. Plug-and-play design requires no configuration. Energy-efficient with auto-negotiation on all ports. Ideal for small offices and home networks.",
  },
];

export const categories = ["All", "Laptops", "Desktops", "Printers", "Accessories", "Networking"];

export const formatPrice = (price: number) =>
  "₦" + price.toLocaleString("en-NG");
