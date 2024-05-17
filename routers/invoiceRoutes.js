const express = require("express");

const InvoiceController = require("../controllers/invoiceController");
const Auth = require("../middleware/auth");
const InvoiceRouter = express.Router();
InvoiceRouter.use(Auth);

InvoiceRouter.post("/", InvoiceController.createInvoice);
InvoiceRouter.patch("/", InvoiceController.updateInvoice);
InvoiceRouter.get("/", InvoiceController.getInvoicesForUser);
InvoiceRouter.delete("/:pointId", InvoiceController.deleteInvoice);

module.exports = InvoiceRouter;
