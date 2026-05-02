const router = require('express').Router();
const pool = require('../database/db');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
router.use(authMiddleware);
router.get('/', async (_req,res)=>{ const r = await pool.query('SELECT * FROM company_settings ORDER BY id DESC LIMIT 1'); res.json({ success:true, data: r.rows[0] || null });});
router.put('/', authorizeRoles('Admin'), async (req,res)=>{ const { company_name, timezone='UTC', theme='light', allow_registration=true, email_from=null, logo=null } = req.body; const r = await pool.query('INSERT INTO company_settings(company_name,timezone,theme,allow_registration,email_from,logo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[company_name,timezone,theme,allow_registration,email_from,logo]); res.json({ success:true, data:r.rows[0]});});
module.exports = router;
