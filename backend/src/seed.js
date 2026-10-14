/**
 * UrbanDana — Database seed (v6 — real pricing: caps ₹249, tees ₹299, combos)
 * - All Urbandana caps: ₹249 (24900 paise)
 * - All T-shirts: ₹299 (29900 paise)
 * - Bundles renamed to "Combo"
 * - No fake oldPrice strikethroughs (removed all inflated "was" prices)
 * - 4 combo products use the 4 real tshirt+cap combo photos
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

// All caps ₹249 (24900 paise), no fake oldPrice
const CAP_PRICE = 24900;
// All tees ₹299 (29900 paise), no fake oldPrice
const TEE_PRICE = 29900;

const CAP_PRODUCTS = [
  { title: "Signature Red Paisley", subtitle: "The cap that started it all",
    description: "Our #1 bestseller. Handcrafted in premium red cotton bandana with classic paisley pattern, structured visor, and adjustable knot-tie. Wear it forward, backward, or fold it low — three looks from one cap. Reinforced stitching at every stress point and a sweat-wicking inner band.",
    category: "Bandana Caps", badge: "Bestseller",
    rating: 4.9, reviews: 247, stock: 80,
    isFeatured: true, isLimited: false,
    colors: ["Red", "Maroon"], sizes: ["One Size"] },
  { title: "Café Culture Black", subtitle: "The most versatile cap we make",
    description: "Goes with everything. Matte black bandana with subtle tonal geometric print, paired with a deep-curve structured visor. The fabric softens beautifully with each wash and develops a unique patina over time.",
    category: "Bandana Caps", badge: "Bestseller",
    rating: 4.8, reviews: 189, stock: 120,
    isFeatured: true, isLimited: false,
    colors: ["Black", "Charcoal"], sizes: ["One Size"] },
  { title: "Classic White Paisley", subtitle: "Crisp, clean, timeless",
    description: "Vintage white paisley on premium cotton bandana. Pairs effortlessly with denim, kurtis, or a sharp shirt. The structured visor holds its curve, and the white fabric stays cool in direct sunlight.",
    category: "Bandana Caps", badge: null,
    rating: 4.7, reviews: 124, stock: 60,
    isFeatured: false, isLimited: false,
    colors: ["White", "Off-White"], sizes: ["One Size"] },
  { title: "Indigo Wave Bandana", subtitle: "Deep indigo with wave motif",
    description: "A serene indigo bandana with hand-drawn wave motif. Pairs beautifully with denim and white tees. The deep blue colourway is sophisticated and versatile — equally at home with streetwear or smart-casual outfits.",
    category: "Bandana Caps", badge: "New",
    rating: 4.7, reviews: 42, stock: 70,
    isFeatured: true, isLimited: false,
    colors: ["Indigo"], sizes: ["One Size"] },
  { title: "Forest Trail Cap", subtitle: "Olive green with trail pattern",
    description: "An earthy olive green bandana with subtle trail-line pattern. Perfect for outdoor adventures, trekking, or everyday streetwear. The olive tone pairs naturally with neutral outfits and denim alike.",
    category: "Bandana Caps", badge: null,
    rating: 4.6, reviews: 38, stock: 85,
    isFeatured: false, isLimited: false,
    colors: ["Olive", "Forest"], sizes: ["One Size"] },
  { title: "Saffron Sunset Bandana", subtitle: "Warm saffron with sunset gradient",
    description: "A warm saffron-orange bandana with a hand-screened sunset gradient. Bold, energetic, and unmistakably Indian. Pairs beautifully with the Saffron Sunset Tee for the complete look.",
    category: "Bandana Caps", badge: "New",
    rating: 4.8, reviews: 56, stock: 65,
    isFeatured: true, isLimited: false,
    colors: ["Saffron", "Orange"], sizes: ["One Size"] },
  { title: "Midnight Geometric Cap", subtitle: "Black with tonal geometric print",
    description: "Matte black bandana with a tonal geometric print that catches the light. Subtle enough for everyday wear, distinctive enough to stand out. Pairs with everything in your wardrobe.",
    category: "Bandana Caps", badge: null,
    rating: 4.7, reviews: 71, stock: 90,
    isFeatured: false, isLimited: false,
    colors: ["Black"], sizes: ["One Size"] },
  { title: "Dusty Rose Bandana", subtitle: "Soft dusty rose with vintage wash",
    description: "A soft dusty rose bandana with a vintage wash finish. Romantic, muted, and surprisingly versatile. Pairs beautifully with white tees, denim jackets, and kurtis.",
    category: "Bandana Caps", badge: null,
    rating: 4.6, reviews: 34, stock: 55,
    isFeatured: false, isLimited: false,
    colors: ["Dusty Rose", "Pink"], sizes: ["One Size"] },
  { title: "Charcoal Sketch Cap", subtitle: "Hand-drawn charcoal sketch design",
    description: "A charcoal grey bandana with a hand-drawn sketch pattern. Edgy, artistic, and unique. Each cap features a slightly different sketch placement — no two are exactly alike.",
    category: "Bandana Caps", badge: null,
    rating: 4.7, reviews: 28, stock: 60,
    isFeatured: false, isLimited: false,
    colors: ["Charcoal", "Grey"], sizes: ["One Size"] },
  { title: "Cream Linen Bandana", subtitle: "Natural cream with linen blend",
    description: "A natural cream bandana with a linen-cotton blend. Breathable, lightweight, and perfect for summer. The cream tone pairs effortlessly with any outfit colour.",
    category: "Bandana Caps", badge: null,
    rating: 4.8, reviews: 45, stock: 50,
    isFeatured: true, isLimited: false,
    colors: ["Cream", "Natural"], sizes: ["One Size"] },

  { title: "Sunset Art Cap", subtitle: "Hand-drawn sun motif. Only 200 pieces.",
    description: "Limited Edition drop. Each cap features a hand-drawn sun motif in golden orange against a deep indigo bandana. Numbered authenticity tag sewn inside. Only 200 pieces will ever be made.",
    category: "Limited Edition", badge: "Limited",
    rating: 5.0, reviews: 38, stock: 12,
    isFeatured: true, isLimited: true,
    colors: ["Indigo / Gold"], sizes: ["One Size"] },
  { title: "Skull Edition", subtitle: "Bold graphics. Matte black visor.",
    description: "Streetwear energy distilled. Black cotton bandana with white skull print, paired with a matte black structured visor. Each Skull Edition comes with a numbered tag and ships in a premium dust-bag.",
    category: "Limited Edition", badge: "Limited",
    rating: 4.9, reviews: 76, stock: 45,
    isFeatured: false, isLimited: true,
    colors: ["Black / White"], sizes: ["One Size"] },
  { title: "Tiger Print", subtitle: "Indian wildlife art. Collector's tag.",
    description: "A bold tribute to Indian wildlife. Hand-illustrated tiger print on saffron bandana with a deep-green structured visor. Each Tiger Print cap carries a numbered collector's tag.",
    category: "Limited Edition", badge: "Limited",
    rating: 4.8, reviews: 52, stock: 28,
    isFeatured: false, isLimited: true,
    colors: ["Saffron / Green"], sizes: ["One Size"] },
  { title: "Monkey Folk Art", subtitle: "Traditional Indian folk illustration",
    description: "A celebration of Indian folk art. Hand-drawn monkey illustration in the Madhubani style, printed on a natural beige bandana. A portion of every sale goes to the folk artist collective in Bihar.",
    category: "Limited Edition", badge: "New",
    rating: 4.7, reviews: 31, stock: 60,
    isFeatured: false, isLimited: true,
    colors: ["Beige / Brown"], sizes: ["One Size"] },
  { title: "Founder's Signature Cap", subtitle: "Vikram Kumar's hand-signed prototype sketch",
    description: "A collector's cap. Features founder Vikram Kumar's hand-signed sketch of the original bandana cap prototype. Numbered tag inside. Only 100 pieces made. A portion of every sale funds the Dehradun artisan workshop.",
    category: "Limited Edition", badge: "Collector",
    rating: 5.0, reviews: 14, stock: 8,
    isFeatured: true, isLimited: true,
    colors: ["Cream / Black"], sizes: ["One Size"] },
  { title: "Peacock Folk Edition", subtitle: "Peacock illustration. Numbered tag.",
    description: "A stunning peacock illustration in traditional Indian folk style, printed on a deep teal bandana. Each Peacock Folk Edition cap carries a numbered tag. Only 150 pieces made.",
    category: "Limited Edition", badge: "Limited",
    rating: 4.9, reviews: 22, stock: 18,
    isFeatured: false, isLimited: true,
    colors: ["Teal / Gold"], sizes: ["One Size"] },

  { title: "Visor Classic — Sand", subtitle: "Minimal visor for everyday wear",
    description: "Our pure visor — no bandana top, just structured curve and breathability. Sand beige with tonal stitching, sweat-wicking inner band, and an adjustable strap.",
    category: "Visors", badge: null,
    rating: 4.6, reviews: 88, stock: 95,
    isFeatured: false, isLimited: false,
    colors: ["Sand", "Olive", "Navy"], sizes: ["Adjustable"] },
];

// Combo products — use the 4 real tshirt+cap combo photos
const COMBO_PRODUCTS = [
  { title: "Cap + Tee Combo — Red", subtitle: "1 cap + 1 matching tee. Best value.",
    description: "The complete look in one pack. One Signature Red Paisley cap + one matching Paisley Oversized Tee. Ships in a premium gift box. The smartest way to get the full Urbandana look.",
    category: "Combo", badge: "Best Value",
    rating: 4.9, reviews: 142, stock: 40,
    isFeatured: true, isLimited: false,
    colors: ["Red / Red"], sizes: ["One Size", "S", "M", "L", "XL"],
    comboImgIndex: 0 },
  { title: "Cap + Tee Combo — Black", subtitle: "1 cap + 1 tee. Streetwear staple.",
    description: "The complete streetwear look. One Café Culture Black cap + one matching Skull Folk Tee. Ships in a premium gift box. Bold, versatile, and ready to wear.",
    category: "Combo", badge: "Best Value",
    rating: 4.8, reviews: 88, stock: 35,
    isFeatured: true, isLimited: false,
    colors: ["Black / Black"], sizes: ["One Size", "S", "M", "L", "XL"],
    comboImgIndex: 1 },
  { title: "Cap + Tee Combo — Indigo", subtitle: "1 cap + 1 tee. Sunset edition.",
    description: "The complete sunset look. One Sunset Art Cap + one matching Sunset Horizon Tee. Only 200 sets made. Each comes with a numbered tag. Ships in a premium gift box.",
    category: "Combo", badge: "Limited",
    rating: 5.0, reviews: 33, stock: 18,
    isFeatured: true, isLimited: true,
    colors: ["Indigo / Indigo"], sizes: ["One Size", "S", "M", "L", "XL"],
    comboImgIndex: 2 },
  { title: "Cap + Tee Combo — Cream", subtitle: "1 cap + 1 tee. Folk edition.",
    description: "The complete folk-art look. One Cream Linen Bandana cap + one matching Cream Linen Blend Tee. Breathable, lightweight, and perfect for summer. Ships in a premium gift box.",
    category: "Combo", badge: "Best Value",
    rating: 4.9, reviews: 27, stock: 30,
    isFeatured: false, isLimited: false,
    colors: ["Cream / Cream"], sizes: ["One Size", "S", "M", "L", "XL"],
    comboImgIndex: 3 },
];

const TSHIRT_PRODUCTS = [
  { title: "Paisley Oversized Tee", subtitle: "Signature red paisley on premium cotton",
    description: "The bandana cap's cousin. Our Signature Red Paisley pattern printed on a 240 GSM heavyweight cotton oversized tee. Drop-shoulder cut, ribbed crew neck, and a soft hand-feel that gets better with every wash. Boxy fit — size down for a regular fit.",
    category: "T-Shirts", badge: "New",
    rating: 4.8, reviews: 64, stock: 75,
    isFeatured: true, isLimited: false,
    colors: ["Red", "Black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Café Culture Graphic Tee", subtitle: "Minimal coffee-inspired typography",
    description: "Café Culture Black cap's tee counterpart. Discreet coffee-cup graphic on the chest, tonal branding on the back hem. 220 GSM combed cotton, regular fit. Pre-shrunk fabric — true to size.",
    category: "T-Shirts", badge: null,
    rating: 4.7, reviews: 48, stock: 110,
    isFeatured: false, isLimited: false,
    colors: ["Black", "Sand"], sizes: ["S", "M", "L", "XL"] },
  { title: "Skull Folk Tee", subtitle: "Bold skull graphic. Streetwear staple.",
    description: "Skull Edition cap's partner in crime. Bold skull graphic across the chest in tonal white print, with a smaller skull tag on the back collar. 240 GSM heavyweight cotton, oversized fit.",
    category: "T-Shirts", badge: null,
    rating: 4.8, reviews: 39, stock: 90,
    isFeatured: false, isLimited: false,
    colors: ["Black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Tiger Stripe Tee", subtitle: "Hand-illustrated tiger. Saffron-on-cream.",
    description: "Matching tee for the Tiger Print cap. Hand-illustrated Bengal tiger across the back in saffron on a natural cream base. Small tiger-stripe tag on the front chest. 220 GSM combed cotton, regular fit.",
    category: "T-Shirts", badge: "New",
    rating: 4.9, reviews: 27, stock: 60,
    isFeatured: true, isLimited: false,
    colors: ["Cream"], sizes: ["S", "M", "L", "XL"] },
  { title: "Sunset Horizon Tee", subtitle: "Gradient sunset. Hand-screened.",
    description: "Sunset Art Cap's counterpart. Hand-screened gradient sunset across the front, with the Sunset Art cap's sun motif on the back. 240 GSM heavyweight cotton, oversized fit. Only 200 pieces made.",
    category: "T-Shirts", badge: "Limited",
    rating: 4.9, reviews: 18, stock: 35,
    isFeatured: false, isLimited: true,
    colors: ["Indigo"], sizes: ["S", "M", "L", "XL"] },
  { title: "Style That Never Stops Tee", subtitle: "The brand tagline. Bold typographic.",
    description: "Wear the manifesto. Bold typographic front print: \"STYLE THAT NEVER STOPS.\" with the Urbandana wordmark on the back collar. 220 GSM combed cotton, regular fit. Pre-shrunk, true to size.",
    category: "T-Shirts", badge: "Bestseller",
    rating: 4.8, reviews: 156, stock: 200,
    isFeatured: true, isLimited: false,
    colors: ["Black", "White", "Sand"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Founder's Signature Tee", subtitle: "Vikram Kumar's hand-signed graphic",
    description: "A collector's tee. Hand-signed graphic by founder Vikram Kumar — the original sketch of the first bandana cap prototype. Numbered tag inside. 240 GSM heavyweight cotton, oversized fit.",
    category: "T-Shirts", badge: "Collector",
    rating: 5.0, reviews: 12, stock: 25,
    isFeatured: false, isLimited: true,
    colors: ["Cream"], sizes: ["S", "M", "L", "XL"] },
  { title: "Peacock Folk Tee", subtitle: "Traditional peacock folk illustration",
    description: "Matching tee for the Peacock Folk Edition cap. Hand-drawn peacock illustration in traditional Indian folk style, printed on a deep teal base. 220 GSM combed cotton, regular fit.",
    category: "T-Shirts", badge: "New",
    rating: 4.8, reviews: 21, stock: 55,
    isFeatured: true, isLimited: false,
    colors: ["Teal"], sizes: ["S", "M", "L", "XL"] },
  { title: "Indigo Wave Oversized Tee", subtitle: "Wave motif on indigo cotton",
    description: "Matching tee for the Indigo Wave Bandana cap. Hand-drawn wave motif printed on a deep indigo base. 240 GSM heavyweight cotton, oversized fit with drop-shoulder cut. Pairs perfectly with the Indigo Wave cap.",
    category: "T-Shirts", badge: null,
    rating: 4.7, reviews: 24, stock: 80,
    isFeatured: false, isLimited: false,
    colors: ["Indigo"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Forest Trail Graphic Tee", subtitle: "Trail-line pattern on olive green",
    description: "Matching tee for the Forest Trail cap. Subtle trail-line graphic on an olive green base. 220 GSM combed cotton, regular fit. Perfect for outdoor adventures and everyday wear.",
    category: "T-Shirts", badge: null,
    rating: 4.6, reviews: 18, stock: 95,
    isFeatured: false, isLimited: false,
    colors: ["Olive"], sizes: ["S", "M", "L", "XL"] },
  { title: "Saffron Sunset Gradient Tee", subtitle: "Sunset gradient on saffron cotton",
    description: "Matching tee for the Saffron Sunset Bandana cap. Hand-screened sunset gradient on a warm saffron base. 240 GSM heavyweight cotton, oversized fit. Bold, energetic, and unmistakably Indian.",
    category: "T-Shirts", badge: "New",
    rating: 4.8, reviews: 31, stock: 70,
    isFeatured: true, isLimited: false,
    colors: ["Saffron"], sizes: ["S", "M", "L", "XL"] },
  { title: "Midnight Geometric Tee", subtitle: "Tonal geometric print on black",
    description: "Matching tee for the Midnight Geometric cap. Tonal geometric print on a matte black base. 220 GSM combed cotton, regular fit. Subtle enough for everyday, distinctive enough to stand out.",
    category: "T-Shirts", badge: null,
    rating: 4.7, reviews: 26, stock: 100,
    isFeatured: false, isLimited: false,
    colors: ["Black"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Dusty Rose Vintage Tee", subtitle: "Soft dusty rose with vintage wash",
    description: "Matching tee for the Dusty Rose Bandana cap. Soft dusty rose with a vintage wash finish. 220 GSM combed cotton, regular fit. Romantic, muted, and surprisingly versatile.",
    category: "T-Shirts", badge: null,
    rating: 4.6, reviews: 15, stock: 65,
    isFeatured: false, isLimited: false,
    colors: ["Dusty Rose"], sizes: ["S", "M", "L", "XL"] },
  { title: "Charcoal Sketch Oversized Tee", subtitle: "Hand-drawn sketch on charcoal grey",
    description: "Matching tee for the Charcoal Sketch cap. Hand-drawn sketch graphic on a charcoal grey base. 240 GSM heavyweight cotton, oversized fit. Edgy, artistic, and unique.",
    category: "T-Shirts", badge: null,
    rating: 4.7, reviews: 19, stock: 75,
    isFeatured: false, isLimited: false,
    colors: ["Charcoal"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { title: "Cream Linen Blend Tee", subtitle: "Natural cream with linen-cotton blend",
    description: "Matching tee for the Cream Linen Bandana cap. Natural cream with a linen-cotton blend. Breathable, lightweight, and perfect for summer. 220 GSM, regular fit.",
    category: "T-Shirts", badge: null,
    rating: 4.8, reviews: 22, stock: 60,
    isFeatured: true, isLimited: false,
    colors: ["Cream"], sizes: ["S", "M", "L", "XL"] },
];

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Seeding UrbanDana v6 (caps ₹249, tees ₹299, combos, no fake prices)...");

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

  // Cap products — all ₹249, no oldPrice
  const capImgsPerProduct = Math.max(1, Math.floor(CAPS_IMGS.length / CAP_PRODUCTS.length));
  for (let i = 0; i < CAP_PRODUCTS.length; i++) {
    const p = CAP_PRODUCTS[i];
    let imgs = CAPS_IMGS.slice(i * capImgsPerProduct, (i + 1) * capImgsPerProduct);
    if (COMBOS_IMGS.length > 0) {
      imgs = [...imgs, COMBOS_IMGS[i % COMBOS_IMGS.length]];
    }
    await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title, subtitle: p.subtitle, description: p.description,
        category: p.category, badge: p.badge,
        price: CAP_PRICE, oldPrice: null,
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
    console.log(`   [CAP ₹249] ${p.title}  (${imgs.length} images)`);
  }

  // Combo products — use the 4 real combo photos, price = cap + tee = ₹548
  const COMBO_PRICE = CAP_PRICE + TEE_PRICE; // ₹548
  for (let i = 0; i < COMBO_PRODUCTS.length; i++) {
    const p = COMBO_PRODUCTS[i];
    const comboImg = COMBOS_IMGS[p.comboImgIndex];
    // Use 2-3 combo shots + a few cap images for variety
    const imgs = [
      comboImg,
      COMBOS_IMGS[(p.comboImgIndex + 1) % COMBOS_IMGS.length],
      CAPS_IMGS[i * 10], // one cap image
    ].filter(Boolean);

    await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title, subtitle: p.subtitle, description: p.description,
        category: p.category, badge: p.badge,
        price: COMBO_PRICE, oldPrice: null,
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
    console.log(`   [COMBO ₹548] ${p.title}  (${imgs.length} images — combo photos)`);
  }

  // T-shirt products — all ₹299, no oldPrice
  for (let i = 0; i < TSHIRT_PRODUCTS.length; i++) {
    const p = TSHIRT_PRODUCTS[i];
    const tshirtImgs = [
      TSHIRTS_IMGS[i % TSHIRTS_IMGS.length],
      TSHIRTS_IMGS[(i + 1) % TSHIRTS_IMGS.length],
    ].filter(Boolean);
    const modelImgs = [
      MODELS_IMGS[i % MODELS_IMGS.length],
      MODELS_IMGS[(i + 1) % MODELS_IMGS.length],
    ].filter(Boolean);
    const imgs = [...tshirtImgs, ...modelImgs];

    await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title, subtitle: p.subtitle, description: p.description,
        category: p.category, badge: p.badge,
        price: TEE_PRICE, oldPrice: null,
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
    console.log(`   [TEE ₹299] ${p.title}  (${imgs.length} images)`);
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

  console.log(`\nSeed v6 complete!`);
  console.log(`  ${CAP_PRODUCTS.length} caps (₹249) + ${COMBO_PRODUCTS.length} combos (₹548) + ${TSHIRT_PRODUCTS.length} tees (₹299) = ${CAP_PRODUCTS.length + COMBO_PRODUCTS.length + TSHIRT_PRODUCTS.length} total`);
  console.log(`  Image folders: caps (${CAPS_IMGS.length}), tshirts (${TSHIRTS_IMGS.length}), models (${MODELS_IMGS.length}), combos (${COMBOS_IMGS.length})`);
  console.log("  No fake oldPrice strikethroughs — all prices are real");
  console.log("  Admin login: admin@urbandana.in / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
