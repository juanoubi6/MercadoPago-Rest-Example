const Status = require("../status");
const config = require("../config/config");
const MP = require("mercadopago");

const mp = new MP(config.MP_ACCESS_TOKEN); //Key del dueño de la aplicacion

let CaptureController = {
  createCapture,
  claimCapture,
  cancelCapture
};

//Congela dinero de la tarjeta de credto que se ingrese. Se tienen 7 dias habiles para cobrar ese dinero o cancelarlo
function createCapture(req, res) {

  const body = req.body;

  const data = {
    "payer": {
      "type":"customer",
      "id": body.payer.customerID
    },
    "transaction_amount": body.transaction_amount,
    "token": body.token,
    "description": body.description + "(RESERVA)",
    "payment_method_id": body.payment_method_id,
    "installments": body.installments,
    "capture":false
  };

  mp.post({
    uri: "/v1/payments",
    data: data
  })
    .then(captureData => {
      res.dispatch(Status.OK, "", captureData.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}

//Capturar el pago. Se puede capturar un monto menor si se envia cantidad
function claimCapture(req,res){

  let id = req.params.id;

  let data = {
    capture:true
  }

  //Chequeo si quiero capturar una cantidad distinta a la reservada o no (asegurarnos que sea menor)
  if (req.body.captureAmount){
    data.transaction_amount = parseFloat(req.body.captureAmount);
  }

  mp.put({
    uri: "/v1/payments/" + id,
    data:data
  })
    .then(capturedPaymentData => {
      res.dispatch(Status.OK, "", capturedPaymentData.response);
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

//Cancelar la captura
function cancelCapture(req,res){

  let id = req.params.id;

  mp.put({
    uri: "/v1/payments/" + id,
    data:{status:"cancelled"}
  })
    .then(cancelledPaymentData => {
      res.dispatch(Status.OK, "", cancelledPaymentData.response);
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

module.exports = CaptureController;
