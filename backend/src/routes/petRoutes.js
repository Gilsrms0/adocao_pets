import { Router } from "express";
import {
  upload,
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  getAllPetsAdmin,
} from "../controllers/petController.js";

// CORREÇÃO: Ajustando o caminho do middleware para ser consistente
import { verifyToken, isAdmin } from "../auth/authMiddleware.js";

const router = Router();

// Rotas protegidas
router.post("/", verifyToken, isAdmin, upload.single("image"), createPet);
router.get("/", getAllPets); // Pública
router.get("/admin", verifyToken, isAdmin, getAllPetsAdmin); // Rota /admin antes de /:id
router.get("/:id", getPetById); // Pública
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updatePet);
router.delete("/:id", verifyToken, isAdmin, deletePet);

export default router;