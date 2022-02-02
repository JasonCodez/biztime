/** BizTime express application. */


const express = require("express");

const app = express();

const companiesRoutes = require('../express-biztime/routes/companies');
const invoicesRoutes = require('../express-biztime/routes/invoices');
const ExpressError = require("./expressError")

app.use(express.json());
app.use('/companies', companiesRoutes);
app.use('/invoices', invoicesRoutes);



/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: {
       response: err.message,
       status: err.status
    }
  });
});


module.exports = app;
