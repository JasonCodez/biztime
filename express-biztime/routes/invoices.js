const express = require('express');
const db = require('../db');
const ExpressError = require('../expressError');
const router = new express.Router();

router.get('/', async (req, res) => {
   const results = await db.query(`SELECT * FROM invoices`);
   return res.json({ invoices: results.rows });
})

router.get('/:id', async (req, res, next) => {
   try {
      const { id } = req.params;
      const results = await db.query(`SELECT * FROM invoices WHERE id = '${id}'`);
      if(results.rows.length === 0) {
         throw new ExpressError("Invoice not found", 404);
      }
      return res.json({ invoice: results.rows[0] });
   } catch(e) {
      return next(e);
   }
})

router.post('/', async (req, res, next) => {
   const { comp_code, amt, paid, add_date, paid_date } = req.body;
   const results = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`, [comp_code, amt, paid, add_date, paid_date]);
   res.status(201).json({ invoice: results.rows[0]});
})

router.put('/:id', async (req, res, next) => {
   try {
      const { comp_code, amt, paid, add_date, paid_date } = req.body;
      const results = await db.query(
         `UPDATE invoices
         SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5
         WHERE id = $6
         RETURNING *`, [comp_code, amt, paid, add_date, paid_date, req.params.id]);
      if(results.rows.length === 0) {
         throw new ExpressError("Invoice not found", 404);
      }
      return res.json({ invoice: results.rows[0] });
   } catch(e) {
      next(e);
   }
})

router.delete('/:id', async (req, res, next) => {
   const results = await db.query(`DELETE FROM invoices WHERE id = $1`, [req.params.id]);
   return res.json({message: "Deleted"});
})



module.exports = router;