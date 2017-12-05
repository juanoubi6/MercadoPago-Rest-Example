const Status = require("../status");
const config = require("../config/config");
const MP = require("mercadopago");

const mp = new MP(config.MP_ACCESS_TOKEN); //Key del dueño de la aplicacion

let SubscriptionController = {
  createPlan,
  createSubscription,
  updatePlan
};

//Creo un plan de pagos, definiendo cuanto se paga y cada cuanto
function createPlan(req, res) {

  const body = req.body;

  //Mas informacion de los planes en https://www.mercadopago.com.ar/developers/en/solutions/payments/custom-checkout/plans-and-subscriptions/
  let data = {
    description: body.description,
    auto_recurring:{
      frequency:1,
      frequency_type:"months",
      transaction_amount:parseFloat(body.planAmount),
      debit_date: 1,                                      //Dia del mes que se va a cobrar
    }
  };

  mp.post({
    uri: "/v1/plans",
    data: data
  })
    .then(planData => {
      res.dispatch(Status.OK, "", planData.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}

//Creo una subscripcion de un customer a un plan
function createSubscription(req, res) {

  const body = req.body;

  let data = {
    plan_id: body.plan_id,
    payer:{
      id:body.customer_id
    }
  };

  mp.post({
    uri: "/v1/subscriptions",
    data: data
  })
    .then(subscriptionData => {
      res.dispatch(Status.OK, "", subscriptionData.response);




    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}

//Modifico el plan
function updatePlan(req,res){

  let id = req.params.id

  const body = req.body;

  let data = {
    auto_recurring:{
      transaction_amount:parseFloat(body.planAmount),
    }
  };

  mp.put({
    uri: "/v1/plans/" + id,
    data: data
  })
    .then(planData => {
      res.dispatch(Status.OK, "", planData.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}
module.exports = SubscriptionController;
