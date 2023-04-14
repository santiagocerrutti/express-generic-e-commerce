import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Contesto",
    name: "Santiago",
    productList: [1, 2, 3, 4, 5],
  });
});

export default router;
