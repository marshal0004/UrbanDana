/**
 * UrbanDana — Database seed (v4 — real tshirt images + model shots)
 */
import prisma from "./lib/prisma.js";
import fs from "node:fs";
import path from "node:path";

const UPLOADS = path.resolve("./uploads/products");

function listImages(subfolder) {
  const dir = path.join(UPLOADS, subfolder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/uploads/products/${subfolder}/${f}`);
}

const CAPS_IMGS = listImages("caps");
const TSHIRTS_IMGS = listImages("tshirts");
const MODELS_IMGS = listImages("models");
const COMBOS_IMGS = listImages("combos");

console.log(`Image pools: caps=${CAPS_IMGS.length}, tshirts=${TSHIRTS_IMGS.length}, models=${MODELS_IMGS.length}, combos=${COMBOS_IMGS.length}`);

const CAP_PRODUCTS = [
  { title: "Signature Red Paisley", subtitle: "The cap that started it all",
    description: "Our #1 bestseller. Handcrafted in premium red cotton bandana with classic paisley pattern, structured visor, and adjustable knot-tie. Wear it forward, backward, or fold it low — three looks from one cap. The drop-shoulder silhouette suits every face shape, and the breathable bandana top keeps your head cool even in peak Indian summer. Reinforced stitching at every stress point and a sweat-wicking inner band make this the cap you'll reach for every single day.",
    category: "Bandana Caps", badge: "Bestseller",
    price: 149900, oldPrice: null, rating: 4.9, reviews: 247, stock: 80,
    isFeatured: true, isLimited: false,
    colors: ["Red", "Maroon"], sizes: ["One Size"] },
  { title: "Café Culture Black", subtitle: "The most versatile cap we make",
    description: "Goes with everything. Matte black bandana with subtle tonal geometric print, paired with a deep-curve structured visor. This is the cap that disappears into any outfit — streetwear, kurti, ethnic, athleisure. The fabric softens beautifully with each wash and develops a unique patina over time.",
    category: "Bandana Caps", badge: "Bestseller",
    price: 139900, oldPrice: 179900, rating: 4.8, reviews: 189, stock: 120,
    isFeatured: true, isLimited: false,
    colors: ["Black", "Charcoal"], sizes: ["One Size"] },
  { title: "Classic White Paisley", subtitle: "Crisp, clean, timeless",
    description: "Vintage white paisley on premium cotton bandana. Pairs effortlessly with denim, kurtis, or a sharp shirt. The structured visor holds its curve, and the white fabric stays cool in direct sunlight.",
    category: "Bandana Caps", badge: null,
    price: 149900, oldPrice: null, rating: 4.7, reviews: 124, stock: 0,
    isFeatured: false, isLimited: false,
    colors: ["White", "Off-White"], sizes: ["One Size"] },
  { title: "Sunset Art Cap", subtitle: "Hand-drawn sun motif. Only 200 pieces.",
    description: "Limited Edition drop. Each cap features a hand-drawn sun motif in golden orange against a deep indigo bandana. Numbered authenticity tag sewn inside. Only 200 pieces will ever be made.",
    category: "Limited Edition", badge: "Limited",
    price: 179900, oldPrice: null, rating: 5.0, reviews: 38, stock: 12,
    isFeatured: true, isLimited: true,
    colors: ["Indigo / Gold"], sizes: ["One Size"] },
  { title: "Skull Edition", subtitle: "Bold graphics. Matte black visor.",
    description: "Streetwear energy distilled. Black cotton bandana with white skull print, paired with a matte black structured visor. Each Skull Edition comes with a numbered tag and ships in a premium dust-bag.",
    category: "Limited Edition", badge: "Limited",
    price: 169900, oldPrice: null, rating: 4.9, reviews: 76, stock: 45,
    isFeatured: false, isLimited: true,
    colors: ["Black / White"], sizes: ["One Size"] },
  { title: "Tiger Print", subtitle: "Indian wildlife art. Collector's tag.",
    description: "A bold tribute to Indian wildlife. Hand-illustrated tiger print on saffron bandana with a deep-green structured visor. Each Tiger Print cap carries a numbered collector's tag.",
    category: "Limited Edition", badge: "Limited",
    price: 169900, oldPrice: null, rating: 4.8, reviews: 52, stock: 28,
    isFeatured: false, isLimited: true,
    colors: ["Saffron / Green"], sizes: ["One Size"] },
  { title: "Monkey Folk Art", subtitle: "Traditional Indian folk illustration",
    description: "A celebration of Indian folk art. Hand-drawn monkey illustration in the Madhubani style, printed on a natural beige bandana. A portion of every sale goes to the folk artist collective in Bihar.",
    category: "Limited Edition", badge: "New",
    price: 169900, oldPrice: null, rating: 4.7, reviews: 31, stock: 60,
    isFeatured: false, isLimited: true,
    colors: ["Beige / Brown"], sizes: ["One Size"] },
  { title: "Visor Classic — Sand", subtitle: "Minimal visor for everyday wear",
    description: "Our pure visor — no bandana top, just structured curve and breathability. Sand beige with tonal stitching, sweat-wicking inner band, and an adjustable strap.",
    category: "Visors", badge: null,
    price: 129900, oldPrice: null, rating: 4.6, reviews: 88, stock: 95,
    isFeatured: false, isLimited: false,
    colors: ["Sand", "Olive", "Navy"], sizes: ["Adjustable"] },
  { title: "Visor Duo Pack", subtitle: "2 visors. Mix & match. Save ₹500.",
    description: "Two of our classic visors in colours of your choice. Each visor ships in its own dust-bag, and the duo pack arrives in a premium gift box. The smartest value buy in the Urbandana catalogue.",
    category: "Bundles", badge: "Best Value",
    price: 249900, oldPrice: 299900, rating: 4.9, reviews: 142, stock: 40,
    isFeatured: true, isLimited: false,
    colors: ["Mix & Match"], sizes: ["Adjustable"] },
  { title: "Collector's Full Set", subtitle: "All 6 signature colourways. Save ₹2,000.",
    description: "The complete Urbandana collection in one box. Six signature bandana caps — Signature Red, Café Culture Black, Classic White, Sunset Art, Skull Edition, and Tiger Print — presented in a premium wooden gift box with a numbered certificate of authenticity.",
    category: "Bundles", badge: "Collector",
    price: 799900, oldPrice: 999900, rating: 5.0, reviews: 23, stock: 8,
    isFeatured: true, isLimited: false,
    colors: ["6 Caps"], sizes: ["One Size"] },
];

const TSHIRT_PRODUCTS = [
  { title: "Paisley Oversized Tee", subtitle: "Signature red paisley on premium cotton",
    description: "The bandana cap's cousin. Our Signature Red Paisley pattern printed on a 240 GSM heavyweight cotton oversized tee. Drop-shoulder cut, ribbed crew neck, and a soft hand-feel that gets better with every wash. Pairs perfectly with the Signature Red Paisley cap for the full look. Boxy fit — size down for a regular fit.",
    category: "T-Shirts", badge: "New",
    price: 99900, oldPrice: 149900, rating: 4.8, reviews: 64, stock: 75,
    isFeatured: true, isLimited: false,
    colors: ["Red", "Black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Café Culture Graphic Tee", subtitle: "Minimal coffee-inspired typography",
    description: "Café Culture Black cap's tee counterpart. Discreet coffee-cup graphic on the chest, tonal branding on the back hem. 220 GSM combed cotton, regular fit. The kind of tee you can wear to a brunch and a gig the same day. Pre-shrunk fabric — true to size.",
    category: "T-Shirts", badge: null,
    price: 79900, oldPrice: 119900, rating: 4.7, reviews: 48, stock: 110,
    isFeatured: false, isLimited: false,
    colors: ["Black", "Sand"], sizes: ["S", "M", "L", "XL"] },
  { title: "Skull Folk Tee", subtitle: "Bold skull graphic. Streetwear staple.",
    description: "Skull Edition cap's partner in crime. Bold skull graphic across the chest in tonal white print, with a smaller skull tag on the back collar. 240 GSM heavyweight cotton, oversized fit. Pairs with the Skull Edition cap for the full streetwear look. Boxy fit — size down for regular.",
    category: "T-Shirts", badge: null,
    price: 89900, oldPrice: 129900, rating: 4.8, reviews: 39, stock: 90,
    isFeatured: false, isLimited: false,
    colors: ["Black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Tiger Stripe Tee", subtitle: "Hand-illustrated tiger. Saffron-on-cream.",
    description: "Matching tee for the Tiger Print cap. Hand-illustrated Bengal tiger across the back in saffron on a natural cream base. Small tiger-stripe tag on the front chest. 220 GSM combed cotton, regular fit. Every tee supports the Indian wildlife artist collective.",
    category: "T-Shirts", badge: "New",
    price: 94900, oldPrice: 139900, rating: 4.9, reviews: 27, stock: 60,
    isFeatured: true, isLimited: false,
    colors: ["Cream"], sizes: ["S", "M", "L", "XL"] },
  { title: "Sunset Horizon Tee", subtitle: "Gradient sunset. Hand-screened.",
    description: "Sunset Art Cap's counterpart. Hand-screened gradient sunset across the front, with the Sunset Art cap's sun motif on the back. 240 GSM heavyweight cotton, oversized fit. Only 200 pieces made — each tee comes with a numbered tag matching the Sunset Art Cap edition. Pair them for the complete drop.",
    category: "T-Shirts", badge: "Limited",
    price: 109900, oldPrice: null, rating: 4.9, reviews: 18, stock: 35,
    isFeatured: false, isLimited: true,
    colors: ["Indigo"], sizes: ["S", "M", "L", "XL"] },
  { title: "Style That Never Stops Tee", subtitle: "The brand tagline. Bold typographic.",
    description: "Wear the manifesto. Bold typographic front print: \"STYLE THAT NEVER STOPS.\" with the Urbandana wordmark on the back collar. 220 GSM combed cotton, regular fit. The tee that goes with every cap in the catalogue. Pre-shrunk, true to size.",
    category: "T-Shirts", badge: "Bestseller",
    price: 69900, oldPrice: 99900, rating: 4.8, reviews: 156, stock: 200,
    isFeatured: true, isLimited: false,
    colors: ["Black", "White", "Sand"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Founder's Signature Tee", subtitle: "Vikram Kumar's hand-signed graphic",
    description: "A collector's tee. Hand-signed graphic by founder Vikram Kumar — the original sketch of the first bandana cap prototype. Numbered tag inside. 240 GSM heavyweight cotton, oversized fit. A portion of every sale funds the Dehradun artisan workshop where Urbandana was born.",
    category: "T-Shirts", badge: "Collector",
    price: 129900, oldPrice: null, rating: 5.0, reviews: 12, stock: 25,
    isFeatured: false, isLimited: true,
    colors: ["Cream"], sizes: ["S", "M", "L", "XL"] },
  { title: "3-in-1 Tri-Blend Tee", subtitle: "Cap + tee + bandana bundle save",
    description: "The complete look in one pack. One Signature Red Paisley cap + one matching Paisley Oversized Tee + one loose bandana for pocket/head/neck. Save ₹400 versus buying separately. Ships in a premium gift box.",
    category: "Bundles", badge: "Best Value",
    price: 209900, oldPrice: 249900, rating: 4.9, reviews: 33, stock: 50,
    isFeatured: true, isLimited: false,
    colors: ["Red / Red / Red"], sizes: ["S", "M", "L", "XL"] },
];

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Seeding UrbanDana v4 (real tshirt images + model shots)...");

  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cmsContent.deleteMany();
  console.log("   Cleared existing data");

  const bcrypt = (await import("bcryptjs")).default;
  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@urbandana.in", password: adminPass,
      firstName: "Vikram", lastName: "Kumar", role: "ADMIN", phone: "+91 98765 43210",
    },
  });
  console.log("   Admin: admin@urbandana.in / admin123");

  const capImgsPerProduct = Math.max(1, Math.floor(CAPS_IMGS.length / CAP_PRODUCTS.length));
  for (let i = 0; i < CAP_PRODUCTS.length; i++) {
    const p = CAP_PRODUCTS[i];
    const imgs = CAPS_IMGS.slice(i * capImgsPerProduct, (i + 1) * capImgsPerProduct);
    if (COMBOS_IMGS.length > 0) {
      imgs.push(COMBOS_IMGS[i % COMBOS_IMGS.length]);
    }
    await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title, subtitle: p.subtitle, description: p.description,
        category: p.category, badge: p.badge,
        price: p.price, oldPrice: p.oldPrice,
        rating: p.rating, reviews: p.reviews, stock: p.stock,
        isFeatured: p.isFeatured, isLimited: p.isLimited,
        images: {
          create: imgs.map((url, idx) => ({ url, alt: `${p.title} — view ${idx + 1}`, position: idx })),
        },
        variants: {
          create: [
            ...p.colors.map((c) => ({ name: "color", value: c, stock: p.stock })),
            ...p.sizes.map((s) => ({ name: "size", value: s, stock: p.stock })),
          ],
        },
      },
    });
    console.log(`   [CAP] ${p.title}  (${imgs.length} images)`);
  }

  const tshirtsPerProduct = Math.max(1, Math.floor(TSHIRTS_IMGS.length / TSHIRT_PRODUCTS.length));
  const modelsPerProduct = Math.max(1, Math.floor(MODELS_IMGS.length / TSHIRT_PRODUCTS.length));
  for (let i = 0; i < TSHIRT_PRODUCTS.length; i++) {
    const p = TSHIRT_PRODUCTS[i];
    const productShots = TSHIRTS_IMGS.slice(i * tshirtsPerProduct, (i + 1) * tshirtsPerProduct);
    const modelShots = MODELS_IMGS.slice(i * modelsPerProduct, (i + 1) * modelsPerProduct);
    const tshirtImgs = productShots.length > 0
      ? productShots
      : [TSHIRTS_IMGS[i % TSHIRTS_IMGS.length], TSHIRTS_IMGS[(i + 1) % TSHIRTS_IMGS.length]].filter(Boolean);
    const modelImgs = modelShots.length > 0
      ? modelShots
      : [MODELS_IMGS[i % MODELS_IMGS.length]].filter(Boolean);
    const imgs = [...tshirtImgs, ...modelImgs];

    await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title, subtitle: p.subtitle, description: p.description,
        category: p.category, badge: p.badge,
        price: p.price, oldPrice: p.oldPrice,
        rating: p.rating, reviews: p.reviews, stock: p.stock,
        isFeatured: p.isFeatured, isLimited: p.isLimited,
        images: {
          create: imgs.map((url, idx) => ({
            url, alt: `${p.title} — ${idx < tshirtImgs.length ? "product" : "model"} view ${idx + 1}`, position: idx
          })),
        },
        variants: {
          create: [
            ...p.colors.map((c) => ({ name: "color", value: c, stock: p.stock })),
            ...p.sizes.map((s) => ({ name: "size", value: s, stock: p.stock })),
          ],
        },
      },
    });
    console.log(`   [TEE] ${p.title}  (${tshirtImgs.length} product + ${modelImgs.length} model = ${imgs.length} images)`);
  }

  await prisma.cmsContent.create({
    data: {
      key: "founder",
      value: JSON.stringify({
        name: "Vikram Kumar",
        origin: "Delhi & Dehradun, Uttarakhand, India",
        story: "Urbandana was founded by Vikram Kumar. He grew up in Delhi, but the idea struck one night in Dehradun, Uttarakhand — surrounded by people wearing bandanas as everyday culture. He thought: what if the bandana and the cap became one? He handcrafted the first prototypes himself. Today Urbandana is India's original bandana cap — an entirely new category of headwear that didn't exist before him.",
        image: "/images/founder.jpg",
      }),
    },
  });
  await prisma.cmsContent.create({
    data: {
      key: "brand",
      value: JSON.stringify({ name: "URBANDANA", tagline: "Style That Never Stops", country: "India", established: "2024" }),
    },
  });
  console.log("   CMS content");

  console.log(`\nSeed v4 complete!`);
  console.log(`  ${CAP_PRODUCTS.length} cap products + ${TSHIRT_PRODUCTS.length} t-shirt products = ${CAP_PRODUCTS.length + TSHIRT_PRODUCTS.length} total`);
  console.log(`  Image folders: caps (${CAPS_IMGS.length}), tshirts (${TSHIRTS_IMGS.length}), models (${MODELS_IMGS.length}), combos (${COMBOS_IMGS.length})`);
  console.log("  Admin login: admin@urbandana.in / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
