const router = require('express').Router();
const pool = require('../database/db');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
router.use(authMiddleware);
router.get('/', authorizeRoles('Admin'), async (_req,res)=>{ const r = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100'); res.json({ success:true, data:r.rows});});
module.exports = router;
