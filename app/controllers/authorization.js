const Status = require("../status");
const config = require("../config/config");
const MP = require("mercadopago");

const mp = new MP(config.MP_ACCESS_TOKEN); //Key del dueño de la aplicacion

let AuthorizationController = {
  getUserAccessToken
};

//A este endpoint se lo llama con el codigo resultane de llamar a
//https://auth.mercadopago.com.ar/authorization?client_id=2729930499639635&response_type=code&platform_id=mp&redirect_uri=https://www.google.com.ar
  //-Client_id es el ID de la aplicacion obtenido de mercadopago.
  //-Redirect uri es la url que configuras en la applicacion en la pagina de mercadopago
function getUserAccessToken(req, res) {

  const body = req.body;

  const data = {
    "client_secret": config.MP_ACCESS_TOKEN,
    "grant_type": "authorization_code",
    "code": body.temporalToken,                   //Token temporal que me manda el front
    "redirect_uri": "https://www.google.com.ar"   //Cambiala por la que tengas definida en la app (el valor de redirect uri)
  };

  mp.post({
    uri: "/oauth/token",
    data: data,
    headers:{
      "content-type":"application/x-www-form-urlencoded"
    },
    authenticate: false
  })
    .then(userCredentials => {
      //De la respuesta, se debe almacenar el ACCESS_TOKEN en el registro asociado al usuario en la BD. Ese token se usara para realizar pagos HACIA el usuario.
      res.dispatch(Status.OK, "", userCredentials.response);
    })
  .catch(err => {
    res.dispatch(err.status,err.message,"" );
  });

}


module.exports = AuthorizationController;
