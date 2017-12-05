const Status = require("./status");
const config = require("./config/config");
const MP = require("mercadopago");

//Controllers
let Customers = require("./controllers/customer");
let Payments = require("./controllers/payment");
let Authorization = require("./controllers/authorization");
let Captures = require("./controllers/capture");
let Subscriptions = require("./controllers/subscription");

module.exports = function routes(app) {

  //Authorization endpoints
  app.post('/authorization',Authorization.getUserAccessToken)

  //Payment endpoints
  app.get('/payment/:id',Payments.getPaymentById);
  app.post('/payment', Payments.createPayment);
  app.post('/usersPayment', Payments.transferMoneyBetweenUsers);

  //Plans and subscriptions endpoints
  app.post('/plan',Subscriptions.createPlan);
  app.put('/plan/:id',Subscriptions.updatePlan);
  app.post('/subscription',Subscriptions.createSubscription);

  //Capture endpoints
  app.post('/capture',Captures.createCapture);
  app.put('/capture/:id/approve',Captures.claimCapture);
  app.put('/capture/:id/cancel',Captures.cancelCapture);

  //Refund endpoints
  app.post('/payment/:id/refunds', Payments.refundPayment)

  //Customer endpoints
  app.post('/customers',                              Customers.createCustomer);
  app.get('/customers/:id',                           Customers.getCustomer);
  app.put('/customers/:id',                           Customers.updateCustomer);
  app.delete('/customers/:id',                        Customers.removeCustomer);
  app.get('/searchCustomer',                          Customers.searchCustomer);

  //Card endpoints
  app.post('/customers/:id/cards',                    Customers.addCard);
  app.delete('/customers/:customerID/cards/:cardID',  Customers.removeCard);

  app.use((req, res) => {
    res.dispatch(Status.NOT_FOUND);
  });

};
