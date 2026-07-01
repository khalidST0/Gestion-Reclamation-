const express = require("express");
const { pool } = require("../config/db");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/*
 * TEST ROUTE
 */
router.get("/test", (req, res) => {
  res.json({
    message: "Reclamation routes working"
  });
});

/*
 * CREATE RECLAMATION
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("JWT USER:", req.user);
    console.log("BODY:", req.body);

    const { sujet, description } = req.body;

    const result = await pool.query(
      `INSERT INTO reclamations
       (client_id, sujet, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        req.user.id,
        sujet,
        description
      ]
    );

    res.status(201).json({
      success: true,
      message: "Réclamation créée",
      reclamation: result.rows[0]
    });

  } catch (error) {
    console.error("CREATE RECLAMATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

/*
 * GET ALL RECLAMATIONS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reclamations ORDER BY date_creation DESC"
    );

    res.json({
      success: true,
      reclamations: result.rows
    });

  } catch (error) {
    console.error("GET RECLAMATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

/*
 * GET STATS (MUST BE ABOVE /:id)
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // Groups all claims by their status and counts them
    const result = await pool.query(`
      SELECT statut, COUNT(*) as count 
      FROM reclamations 
      GROUP BY statut;
    `);

    // Gets the total count 
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM reclamations;');

    res.json({
      success: true,
      total: totalResult.rows[0].total,
      breakdown: result.rows // Returns: [{statut: 'En cours', count: 2}, ...]
    });

  } catch (error) {
    console.error("GET STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors du calcul des statistiques"
    });
  }
});

/*
 * GET ONE RECLAMATION
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reclamations WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Réclamation introuvable"
      });
    }

    res.json({
      success: true,
      reclamation: result.rows[0]
    });

  } catch (error) {
    console.error("GET RECLAMATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

/*
 * UPDATE RECLAMATION STATUS
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { statut } = req.body;

    const result = await pool.query(
      `UPDATE reclamations
       SET statut = $1
       WHERE id = $2
       RETURNING *`,
      [
        statut,
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Réclamation introuvable"
      });
    }

    res.json({
      success: true,
      message: "Réclamation mise à jour",
      reclamation: result.rows[0]
    });

  } catch (error) {
    console.error("UPDATE RECLAMATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

/*
 * DELETE RECLAMATION
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM reclamations WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Réclamation introuvable"
      });
    }

    res.json({
      success: true,
      message: "Réclamation supprimée"
    });

  } catch (error) {
    console.error("DELETE RECLAMATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
});

module.exports = router;