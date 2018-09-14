# Endpoints disponibles

1. ABM Customers. Agregarles y borrarles tarjetas de credito. Buscar customers por varios parametros
1. Pagos a la aplicacion, pagos entre usuarios, busqueda de pagos por ID, refund (total o parcial) de pagos
1. Crear "capturas" (pagos que congelan X cantidad de plata de la tarjeta del cliente hasta que los reclamemos o cancelemos). Cancelacion y reclamacion de capturas
1. Creacion de planes de pago (para cobrarle al cliente mensualmente una X cantidad) y subscripciones de customers a planes existentes.

# Como crear customers y agregarles tarjetas (toda la seccion customers)

1. Crear una aplicacion en mercadopago
1. Modificar config.js con los datos correspondientes a la aplicacion (APP ID, CLIENT SECRET Y ACCESS TOKEN).
1. Modificar el generadorDeTokens.html con la key de mercadopago correspondiente
1. Para asignarle una tarjeta a un usuario, obtener un token del generador de tokens (archivo generadorDeTokens.html). 

# Como hacer pagos hacia la aplicacion (endpoint de /payments)

1. Utilizar el generador de tokens para crear tokens de tarjetas de credito
1. Utilizar los endpoints de pago, reemplazando la variable token por el obtenido en el paso anterior

# Como hacer un pago a otro usuario (endpoint /usersPayment)

1. Se debe obtener el access token del usuario al que debe llegarle la plata.
1. Para obtener el access token, hacer que el usuario ingrese a https://auth.mercadopago.com.ar/authorization?client_id=APP_ID&response_type=code&platform_id=mp&redirect_uri=URL_RETORNO (reemplazando el APP_ID y el URL_RETORNO por los de nuestra aplicacion)
1. Cuando el usuario autorize, se mostrata el parametro CODE en la url de retorno. Ese codigo es un codigo temporal que usará el backend para obtener el access token final del usuario.
1. Utilizar ese codigo como parametro en el endpoint de autenticacion. Se obtendra el access token (anotarlo o guardarlo en una BD)
1. Cuando querramos que un pago le llegue a ese usuario, poner el access token en la variable de "receiverAccessToken" (del endpoint /usersPayment)

# Como utilizar el codigo de generadorDeTokens.html

1. Para crear el token, basta con levantar el codigo de ese archivo en un navegador y poner PAY (el numero de tarjeta de credito se va a cambiar automaticamente por el token)
1. Para generar un nuevo token, recargar la pagina (F5)

# Links utiles
1. https://www.mercadopago.com.ar/developers/es/solutions/payments/custom-checkout/mercadopago-connect#get-paid-connect
1. https://www.mercadopago.com.ar/developers/en/solutions/payments/custom-checkout/plans-and-subscriptions/

# Aclaración

Se cuenta con el archivo MercadoPago.postman_collection.json para testear los endpoints.
