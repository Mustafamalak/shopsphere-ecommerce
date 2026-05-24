const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");

dotenv.config();

const products = [
  {
    name: "AirFlex Pro Sneakers",
    description: "Lightweight everyday sneakers with breathable mesh and cushioned sole.",
    price: 2499,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 25,
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: "StreetRun Black Sneakers",
    description: "Minimal black sneakers designed for comfort and streetwear styling.",
    price: 2199,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    stock: 30,
    rating: 4.5,
    isFeatured: true,
  },
  {
    name: "Classic White Trainers",
    description: "Clean white trainers suitable for casual and semi-formal outfits.",
    price: 1999,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    stock: 28,
    rating: 4.4,
    isFeatured: false,
  },
  {
    name: "UrbanFit Smart Watch",
    description: "Stylish smartwatch with heart-rate monitor, steps tracking and long battery life.",
    price: 3999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 18,
    rating: 4.6,
    isFeatured: true,
  },
  {
    name: "NoiseClear Wireless Headphones",
    description: "Wireless headphones with deep bass, soft cushions and noise reduction.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 22,
    rating: 4.5,
    isFeatured: true,
  },
  {
    name: "Pocket Bluetooth Speaker",
    description: "Compact portable speaker with punchy sound and water-resistant design.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    stock: 35,
    rating: 4.3,
    isFeatured: false,
  },
  {
    name: "Classic Cotton Hoodie",
    description: "Premium cotton hoodie with soft fleece lining and modern streetwear fit.",
    price: 1799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    stock: 30,
    rating: 4.4,
    isFeatured: true,
  },
  {
    name: "Oversized Graphic Tee",
    description: "Relaxed fit graphic t-shirt made with soft breathable cotton fabric.",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    stock: 45,
    rating: 4.2,
    isFeatured: false,
  },
  {
    name: "Denim Casual Jacket",
    description: "Rugged denim jacket with a clean urban look and durable stitching.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    stock: 16,
    rating: 4.5,
    isFeatured: false,
  },
  {
    name: "Minimal Leather Wallet",
    description: "Slim leather wallet with card slots and premium textured finish.",
    price: 799,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    stock: 50,
    rating: 4.3,
    isFeatured: false,
  },
  {
    name: "Everyday Backpack",
    description: "Spacious backpack with laptop section, padded straps and water-resistant fabric.",
    price: 1699,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 24,
    rating: 4.6,
    isFeatured: true,
  },
  {
    name: "Round Sunglasses",
    description: "Stylish UV-protected sunglasses with lightweight metal frame.",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    stock: 32,
    rating: 4.1,
    isFeatured: false,
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Premium ceramic mug with smooth matte finish for daily coffee rituals.",
    price: 399,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    stock: 60,
    rating: 4.2,
    isFeatured: false,
  },
  {
    name: "Modern Desk Lamp",
    description: "Adjustable desk lamp with clean design and warm study lighting.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    stock: 20,
    rating: 4.4,
    isFeatured: false,
  },
  {
    name: "Soft Cushion Set",
    description: "Comfortable decorative cushion set for sofa, bed and lounge spaces.",
    price: 1199,
    category: "Home",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
    stock: 26,
    rating: 4.3,
    isFeatured: false,
  },
];

const extraProducts = [];

const categories = ["Shoes", "Electronics", "Fashion", "Accessories", "Home"];

const imageByCategory = {
  Shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  Electronics: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  Fashion: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  Accessories: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  Home: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
};

for (let i = 16; i <= 55; i++) {
  const category = categories[i % categories.length];

  extraProducts.push({
    name: `${category} Essential ${i}`,
    description: `High-quality ${category.toLowerCase()} product designed for everyday use with clean style and reliable value.`,
    price: 499 + i * 75,
    category,
    image: imageByCategory[category],
    stock: 10 + (i % 35),
    rating: Number((4 + (i % 9) / 10).toFixed(1)),
    isFeatured: i % 7 === 0,
  });
}

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();
    await Product.insertMany([...products, ...extraProducts]);

    console.log("55 products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();