const Invoice = require("../models/InvoiceModel");
const User = require("../models/user-model");
const mailer = require("../Emails/EmailController");
const { formatNumberWithCommas } = require("../Utils/Functions");
const { subscribe } = require("../routers/subscriptionRoutes");

const createInvoice = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { description, subscription } = req.body;
  try {
    const invoice = new Invoice({
      user: userid,
      description,
      subscription,
    });

    await invoice.save();

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

const updateInvoice = async (req, res, next) => {
  const userid = req?.userData?.userId;
  const { _id: invoiceId, description, subscription } = req.body;
  try {
    await Invoice.findByIdAndUpdate(invoiceId, {
      description,
      subscription,
    });

    const invoice = await Invoice.findById(invoiceId);

    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

const getInvoicesForUser = async (req, res, next) => {
  try {
    const userid = req?.userData?.userId;
    const invoices = await Invoice.find({ user: userid })
      .populate("user")
      .populate("subscription");

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    await Invoice.findByIdAndDelete(invoiceId);
    res.status(200).json({ status: true });
  } catch (error) {
    console.error("Error deleting invoices:", error);
    throw error;
  }
};

module.exports = {
  createInvoice,
  deleteInvoice,
  getInvoicesForUser,
  updateInvoice,
};
