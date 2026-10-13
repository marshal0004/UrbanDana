import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/founder", async (_req, res, next) => {
  try {
    const data = await prisma.cmsContent.findUnique({ where: { key: "founder" } });
    res.json(data ? JSON.parse(data.value) : {
      name: "Vikram Kumar",
      origin: "Delhi & Dehradun, Uttarakhand, India",
      story: "Urbandana was founded by Vikram Kumar. He grew up in Delhi, but the idea struck one night in Dehradun, Uttarakhand — surrounded by people wearing bandanas as everyday culture. He thought: what if the bandana and the cap became one? He handcrafted the first prototypes himself. Today Urbandana is India's original bandana cap — an entirely new category of headwear that didn't exist before him.",
      image: "/images/founder.jpg",
    });
  } catch (e) {
    next(e);
  }
});

router.get("/brand", async (_req, res, next) => {
  try {
    const data = await prisma.cmsContent.findUnique({ where: { key: "brand" } });
    res.json(data ? JSON.parse(data.value) : {
      name: "URBANDANA",
      tagline: "Style That Never Stops",
      country: "India",
      established: "2024",
      heroImage: "/images/hero.jpg",
    });
  } catch (e) {
    next(e);
  }
});

export default router;
