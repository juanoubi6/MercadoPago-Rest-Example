const Status = require("../status");
const config = require("../config/config");
const MP = require("mercadopago");

const mp = new MP(config.MP_ACCESS_TOKEN);

let CustomerController = {
  getCustomer,
  searchCustomer,
  addCard,
  createCustomer,
  removeCard,
  removeCustomer,
  updateCustomer
};

function getCustomer(req,res){

  let id = req.params.id;

  mp.get({
    uri: "/v1/customers/" + id
  })
    .then(customerData => {
      res.dispatch(Status.OK, "", {customerInformation: customerData.response});
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function searchCustomer(req,res){

  //Req.query tiene todos los parametros de busqueda. Los nombres deben coincidir con https://www.mercadopago.com.ar/developers/en/api-docs/custom-checkout/customers-cards/
  mp.get("/v1/customers/search",req.query)
    .then(customerSearch => {
      res.dispatch(Status.OK, "", {customerInformation: customerSearch.response.results});
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function addCard(req,res){

  let customerID = req.params.id;
  let cardToken = req.body.cardToken;

  mp.get({
    uri: "/v1/customers/" + customerID
  })
    .then(customerData => {
      mp.post({
        uri: "/v1/customers/" + customerData.response.id + "/cards",
        data: {"token":cardToken}
      })
        .then(cardData =>{
          res.dispatch(Status.OK, "", {cardData: cardData.response});
        })
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function createCustomer(req,res){

  const body = req.body;

  //Create the customer following https://www.mercadopago.com.ar/developers/en/api-docs/custom-checkout/customers-cards/
  let customer = {
    "email":body.email,
    "first_name":"elhard",
    "last_name":"codeado"
  }

  mp.post("/v1/customers",customer)
    .then(customerData => {
      res.dispatch(Status.OK, "", {customerInfo: customerData.response});
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function removeCard(req,res){

  let customerID  = req.params.customerID;
  let cardID      = req.params.cardID;

  mp.get({
    uri: "/v1/customers/" + customerID + "/cards/" + cardID
  })
    .then(cardData => {
      mp.delete({
        uri: "/v1/customers/" + customerID + "/cards/" + cardID
      })
        .then(deletedCardData =>{
          res.dispatch(Status.OK, "", );
        })
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function removeCustomer(req,res){

  let id = req.params.id;

  mp.delete({
    uri: "/v1/customers/" + id
  })
    .then(customerDeletedData => {
      res.dispatch(Status.OK, "", );
    })
    .catch(err => {
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });

}

function updateCustomer(req,res){

  let id = req.params.id;

  mp.get({
    uri: "/v1/customers/" + id
  })
    .then(customerData => {
      mp.put({
        uri: "/v1/customers/" + id,
        data: req.body //RECORDAR: NO SE PUEDE MODIFICAR EMAIL
      })
        .then(modifiedCustomerData =>{
          res.dispatch(Status.OK, "", {modifiedCustomerInfo: modifiedCustomerData});
        })
    })
    .catch(err => {
      console.log(err);
      let error = JSON.parse(err.message)
      res.dispatch(error.status,error.message,"" );
    });


}

module.exports = CustomerController;
