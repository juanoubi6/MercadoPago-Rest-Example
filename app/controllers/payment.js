const Status = require("../status");
const config = require("../config/config");
const MP = require("mercadopago");

let PaymentController = {
  createPayment,
  transferMoneyBetweenUsers,
  refundPayment,
  getPaymentById
};

//Estos pagos son de un cliente hacia el dueño de la aplicación
function createPayment(req, res) {

  const mp = new MP(config.MP_ACCESS_TOKEN); //Key del dueño de la aplicacion

  const body = req.body;

  const data = {
    "payer": {
      "type":"customer",
      "id": body.payer.customerID
    },
    "transaction_amount": body.transaction_amount,
    "token": body.token,
    "description": body.description,
    "payment_method_id": body.payment_method_id,
    "installments": body.installments
  };

  mp.post({
    uri: "/v1/payments",
    data: data
  })
    .then(paymentData => {
      res.dispatch(Status.OK, "", paymentData.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}

//Estos pagos son de un cliente X hacia un cliente Y (el dueño de la aplicacion puede cobrar una comision)
function transferMoneyBetweenUsers(req,res){

  const body = req.body;

  //Se deberia recibir del body el ID del usuario al que le va a llegar la plata. Con su ID, busco en la BD el access token asociado.
  //A falta de BD, le paso el access token directamente en la llamada.
  let mp = new MP(body.receiverAccessToken);

  const data = {
    "payer": {
      "type":"customer",
      "id": body.payer.customerID
    },
    "transaction_amount": body.transaction_amount,
    "token": body.token,
    "description": body.description,
    "payment_method_id": body.payment_method_id,
    "application_fee":5,                            //Esta plata va a ir para el dueño de la aplicacion. Es opcional
    "installments": body.installments
  };

  mp.post({
    uri: "/v1/payments",
    data: data
  })
    .then(paymentData => {
      res.dispatch(Status.OK, "", paymentData.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}

//Refund completo o parcial de un pago. Si el pago fue de un cliente a la aplicacion, utilizamos el access token de nuestra aplicacion. Si el pago fue
//de un cliente a otro, necesitamos el access token de la persona que recibio el dinero.
function refundPayment(req,res){

  let mp;
  if(req.body.userAccessToken){
    mp = new MP(req.body.userAccessToken); //Key de un usuario (el que realizo la transaccion)
  }else{
    mp = new MP(config.MP_ACCESS_TOKEN); //Key del dueño de la aplicacion
  }

  let paymentID = req.params.id;

  //Chequeo si es un refund parcial o no
  let refundAmount;
  if (req.body.refundAmount != 0){
    refundAmount = {
      amount:parseFloat(req.body.refundAmount)
    };
  }

  mp.post({
    uri: "/v1/payments/" + paymentID + "/refunds",
    data: refundAmount
  })
    .then(refundData => {
      res.dispatch(Status.OK, "", refundData.response);
    })
    .catch(err => {
      console.log(err);
      res.dispatch(err.status,err.message,"" );
    });

}

function getPaymentById(req,res){

  const mp = new MP(config.MP_ACCESS_TOKEN);

  let id = req.params.id;

  mp.get({
    uri: "/v1/payments/" + id
  })
    .then(paymentData => {
      res.dispatch(Status.OK, "", paymentData.response);
    })
    .catch(err => {
      console.log(err);
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}


module.exports = PaymentController;
