/**
 * UrbanDana — Database seed
 * Creates 10 Urbandana products inferred from chatKnowledge.ts
 * with images grouped from the uploaded zip (100 photos → 10 products × 10 images).
 */
import prisma from "./lib/prisma.js";
import fs from "node:fs";

const imageGroups = JSON.parse(fs.readFileSync("/tmp/product_image_groups.json", "utf-8"));

const PRODUCTS = [
  {
    title: "Signature Red Paisley",
    subtitle: "The cap that started it all",
    description:
      "Our #1 bestseller. Handcrafted in premium red cotton bandana with classic paisley pattern, structured visor, and adjustable knot-tie. Wear it forward, backward, or fold it low — three looks from one cap. The drop-shoulder silhouette suits every face shape, and the breathable bandana top keeps your head cool even in peak Indian summer. Reinforced stitching at every stress point and a sweat-wicking inner band make this the cap you'll reach for every single day.",
    category: "Bandana Caps",
    badge: "Bestseller",
    price: 149900, // ₹1,499
    oldPrice: null,
    rating: 4.9,
    reviews: 247,
    stock: 80,
    isFeatured: true,
    isLimited: false,
    colors: ["Red", "Maroon"],
    sizes: ["One Size"],
  },
  {
    title: "Café Culture Black",
    subtitle: "The most versatile cap we make",
    description:
      "Goes with everything. Matte black bandana with subtle tonal geometric print, paired with a deep-curve structured visor. This is the cap that disappears into any outfit — streetwear, kurti, ethnic, athleisure. The fabric softens beautifully with each wash and develops a unique patina over time. If you're buying your first Urbandana, this is the one. If you're buying your fifth, this is still the one you'll wear most.",
    category: "Bandana Caps",
    badge: "Bestseller",
    price: 139900, // ₹1,399
    oldPrice: 179900,
    rating: 4.8,
    reviews: 189,
    stock: 120,
    isFeatured: true,
    isLimited: false,
    colors: ["Black", "Charcoal"],
    sizes: ["One Size"],
  },
  {
    title: "Classic White Paisley",
    subtitle: "Crisp, clean, timeless",
    description:
      "Vintage white paisley on premium cotton bandana. Pairs effortlessly with denim, kurtis, or a sharp shirt. The structured visor holds its curve, and the white fabric stays cool in direct sunlight. Note: hand wash cold to keep the white crisp — the bandana softens but holds its colour. A genuinely elegant addition to the lineup that transitions seamlessly from a brunch to an evening out.",
    category: "Bandana Caps",
    badge: null,
    price: 149900,
    oldPrice: null,
    rating: 4.7,
    reviews: 124,
    stock: 0, // out of stock (matches chat KB)
    isFeatured: false,
    isLimited: false,
    colors: ["White", "Off-White"],
    sizes: ["One Size"],
  },
  {
    title: "Sunset Art Cap",
    subtitle: "Hand-drawn sun motif. Only 200 pieces.",
    description:
      "Limited Edition drop. Each cap features a hand-drawn sun motif in golden orange against a deep indigo bandana. Numbered authenticity tag sewn inside. Only 200 pieces will ever be made — once they're gone, they're gone forever. This is the crown jewel of the Urbandana lineup, crafted by a Delhi-based folk artist. Allow 5-7 days dispatch as each cap is finished by hand.",
    category: "Limited Edition",
    badge: "Limited",
    price: 179900, // ₹1,799
    oldPrice: null,
    rating: 5.0,
    reviews: 38,
    stock: 12, // almost gone (matches chat KB)
    isFeatured: true,
    isLimited: true,
    colors: ["Indigo / Gold"],
    sizes: ["One Size"],
  },
  {
    title: "Skull Edition",
    subtitle: "Bold graphics. Matte black visor.",
    description:
      "Streetwear energy distilled. Black cotton bandana with white skull print, paired with a matte black structured visor. Reinforced stitching in tonal black thread. Each Skull Edition comes with a numbered tag and ships in a premium dust-bag. Perfect for gigs, night markets, and any moment that needs a statement piece. Pair it with an oversized tee and cargo pants for the full look.",
    category: "Limited Edition",
    badge: "Limited",
    price: 169900, // ₹1,699
    oldPrice: null,
    rating: 4.9,
    reviews: 76,
    stock: 45,
    isFeatured: false,
    isLimited: true,
    colors: ["Black / White"],
    sizes: ["One Size"],
  },
  {
    title: "Tiger Print",
    subtitle: "Indian wildlife art. Collector's tag.",
    description:
      "A bold tribute to Indian wildlife. Hand-illustrated tiger print on saffron bandana with a deep-green structured visor. Each Tiger Print cap carries a numbered collector's tag and is part of a one-time run — no restocks. The saffron and green pairing is striking, intentional, and unmistakably Indian. Wear it forward for the full tiger graphic or fold it low for a subtle saffron band.",
    category: "Limited Edition",
    badge: "Limited",
    price: 169900,
    oldPrice: null,
    rating: 4.8,
    reviews: 52,
    stock: 28,
    isFeatured: false,
    isLimited: true,
    colors: ["Saffron / Green"],
    sizes: ["One Size"],
  },
  {
    title: "Monkey Folk Art",
    subtitle: "Traditional Indian folk illustration",
    description:
      "A celebration of Indian folk art. Hand-drawn monkey illustration in the Madhubani style, printed on a natural beige bandana. Earthy, playful, and full of personality — this cap turns heads without shouting. Pairs beautifully with kurtas, linen shirts, and denim alike. A portion of every Monkey Folk Art sale goes directly to the folk artist collective in Bihar that created the original illustration.",
    category: "Limited Edition",
    badge: "New",
    price: 169900,
    oldPrice: null,
    rating: 4.7,
    reviews: 31,
    stock: 60,
    isFeatured: false,
    isLimited: true,
    colors: ["Beige / Brown"],
    sizes: ["One Size"],
  },
  {
    title: "Visor Classic — Sand",
    subtitle: "Minimal visor for everyday wear",
    description:
      "Our pure visor — no bandana top, just structured curve and breathability. Sand beige with tonal stitching, sweat-wicking inner band, and an adjustable strap. The visor holds its curve shot after shot. Perfect for cricket matches, beach trips, and any day you want shade without coverage. Pairs effortlessly with everything in your wardrobe.",
    category: "Visors",
    badge: null,
    price: 129900, // ₹1,299
    oldPrice: null,
    rating: 4.6,
    reviews: 88,
    stock: 95,
    isFeatured: false,
    isLimited: false,
    colors: ["Sand", "Olive", "Navy"],
    sizes: ["Adjustable"],
  },
  {
    title: "Visor Duo Pack",
    subtitle: "2 visors. Mix & match. Save ₹500.",
    description:
      "Two of our classic visors in colours of your choice. Pick any two from Sand, Olive, Navy, Charcoal, or Maroon. Perfect for couples, best friends, or just to have one in the car and one in the bag. Each visor ships in its own dust-bag, and the duo pack arrives in a premium gift box. The smartest value buy in the Urbandana catalogue — gift-ready out of the box.",
    category: "Bundles",
    badge: "Best Value",
    price: 249900, // ₹2,499
    oldPrice: 299900, // ₹2,999 — save ₹500
    rating: 4.9,
    reviews: 142,
    stock: 40,
    isFeatured: true,
    isLimited: false,
    colors: ["Mix & Match"],
    sizes: ["Adjustable"],
  },
  {
    title: "Collector's Full Set",
    subtitle: "All 6 signature colourways. Save ₹2,000.",
    description:
      "The complete Urbandana collection in one box. Six signature bandana caps — Signature Red, Café Culture Black, Classic White, Sunset Art, Skull Edition, and Tiger Print — presented in a premium wooden gift box with a numbered certificate of authenticity. The ultimate collector's item and the most thoughtful gift for anyone who appreciates Indian craftsmanship, original design, and headwear that does what no other cap can.",
    category: "Bundles",
    badge: "Collector",
    price: 799900, // ₹7,999
    oldPrice: 999900, // ₹9,999 — save ₹2,000
    rating: 5.0,
    reviews: 23,
    stock: 8,
    isFeatured: true,
    isLimited: false,
    colors: ["6 Caps"],
    sizes: ["One Size"],
  },
];

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Seeding Urbandana database...");

  // Wipe existing data
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
  console.log("   ✓ Cleared existing data");

  // Create admin user (admin@urbandana.in / admin123)
  const bcrypt = (await import("bcryptjs")).default;
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@urbandana.in",
      password: adminPass,
      firstName: "Vikram",
      lastName: "Kumar",
      role: "ADMIN",
      phone: "+91 98765 43210",
    },
  });
  console.log(`   ✓ Admin user: admin@urbandana.in / admin123`);

  // Create products
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const images = imageGroups[i] || [];
    const product = await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        category: p.category,
        badge: p.badge,
        price: p.price,
        oldPrice: p.oldPrice,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isLimited: p.isLimited,
        images: {
          create: images.map((filename, idx) => ({
            url: `/uploads/products/${filename}`,
            alt: `${p.title} — view ${idx + 1}`,
            position: idx,
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
    console.log(`   ✓ ${product.title}  (${images.length} images)`);
  }

  // CMS content
  await prisma.cmsContent.create({
    data: {
      key: "founder",
      value: JSON.stringify({
        name: "Vikram Kumar",
        origin: "Delhi & Dehradun, Uttarakhand, India",
        story:
          "Urbandana was founded by Vikram Kumar. He grew up in Delhi, but the idea struck one night in Dehradun, Uttarakhand — surrounded by people wearing bandanas as everyday culture. He thought: what if the bandana and the cap became one? He handcrafted the first prototypes himself. Today Urbandana is India's original bandana cap — an entirely new category of headwear that didn't exist before him.",
        image: "/images/founder.jpg",
      }),
    },
  });
  await prisma.cmsContent.create({
    data: {
      key: "brand",
      value: JSON.stringify({
        name: "URBANDANA",
        tagline: "Style That Never Stops",
        country: "India",
        established: "2024",
      }),
    },
  });
  console.log("   ✓ CMS content (founder + brand)");

  console.log("\n🎉 Seed complete!");
  console.log("   → 10 products, 100 images, 1 admin user");
  console.log("   → Login: admin@urbandana.in / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
