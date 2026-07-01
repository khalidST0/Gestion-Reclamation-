
const db = require('../config/db'); 

exports.getStats = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT statut, COUNT(*) as count 
      FROM reclamations 
      GROUP BY statut;
    `);

    const totalResult = await db.query('SELECT COUNT(*) as total FROM reclamations;');

    res.json({
      total: totalResult.rows[0].total,
      breakdown: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul des statistiques" });
  }
};

