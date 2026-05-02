const router = require('express').Router();
const pool = require('../database/db');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
router.use(authMiddleware);
router.get('/', async (_req, res) => { const r = await pool.query('SELECT * FROM departments ORDER BY id DESC'); res.json({ success: true, data: r.rows }); });
router.post('/', authorizeRoles('Admin','Manager'), async (req, res) => { const { name, description = null, manager_id = null } = req.body; const r = await pool.query('INSERT INTO departments(name,description,manager_id,is_active) VALUES ($1,$2,$3,true) RETURNING *',[name,description,manager_id]); res.status(201).json({ success: true, data: r.rows[0] }); });
router.put('/:id', authorizeRoles('Admin','Manager'), async (req, res) => { const { name, description, manager_id, is_active } = req.body; const r = await pool.query('UPDATE departments SET name=$1,description=$2,manager_id=$3,is_active=$4 WHERE id=$5 RETURNING *',[name,description,manager_id,is_active,req.params.id]); res.json({ success: true, data: r.rows[0] }); });
router.delete('/:id', authorizeRoles('Admin'), async (req, res) => { await pool.query('DELETE FROM departments WHERE id=$1',[req.params.id]); res.json({ success: true, message: 'Department deleted' }); });
module.exports = router;
