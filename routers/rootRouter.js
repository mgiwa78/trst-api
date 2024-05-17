const { Router } = require("express");
const { cardRouter } = require("./card-route");
const { settingsRouter } = require("./settings-route");
const { authRouter } = require("./auth-route");
const subscriptionRouter = require("./subscriptionRoutes");
const shiftRouter = require("./shiftRouter");
const pointRouter = require("./pointRoutes");
const patrolRouter = require("./patrolRoutes");
const InvoiceRouter = require("./invoiceRoutes");

const rootRouter = Router();
rootRouter.get("/", async (req, res) => {
  res.send("Guardtrol API is online and running");
});

rootRouter.use("/settings", settingsRouter);
rootRouter.use("/subscriptions", subscriptionRouter);
rootRouter.use("/shifts", shiftRouter);
rootRouter.use("/patrols", patrolRouter);
rootRouter.use("/invoices", InvoiceRouter);

rootRouter.use("/auth", authRouter);
rootRouter.use("/points", pointRouter);
rootRouter.use("/card", cardRouter);

module.exports = { rootRouter };
