const express = require('express');
const db = require('../db');
const ExpressError = require('../expressError');
const router = new express.Router();

router.get('/', async (req, res) => {
   const results = await db.query(`SELECT * FROM companies`);
   return res.json({ companies: results.rows });
})

router.get('/:code', async (req, res, next) => {
   try {
      const { code } = req.params;
      const company = await db.query(`SELECT * FROM companies WHERE code = '${code}'`);
      const invoice = await db.query(`SELECT * FROM invoices WHERE comp_code = '${code}'`);
      if(company.rows.length === 0) {
         throw new ExpressError("Company not found", 404);
      }
      return res.json({ company: company.rows, invoices: invoice.rows });
   } catch(e) {
      return next(e);
   }
})

router.post('/', async (req, res, next) => {
   const { code, name, description } = req.body;
   const results = await db.query(
      `INSERT INTO companies (code, name, description)
      VALUES ($1, $2, $3)
      RETURNING *`, [code, name, description]);
   res.status(201).json({ company: results.rows[0]});
})

router.put('/:code', async (req, res, next) => {
   try {
      const { name, description } = req.body;
      const results = await db.query(
         `UPDATE companies
         SET name=$1, description=$2
         WHERE code = $3
         RETURNING *`, [name, description, req.params.code]);
      if(results.rows.length === 0) {
         throw new ExpressError("Company not found", 404);
      }
      return res.json({ company: results.rows[0] });
   } catch(e) {
      next(e);
   }
   
})

router.delete('/:code', async (req, res, next) => {
   const results = await db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code]);
   return res.json({message: "Deleted"});
})

module.exports = router;