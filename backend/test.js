let test ={ "sender": "670fe3878c91c8ff45be0f50",
    "receiver": "670fe3878c91c8ff45be0f54",
    "senderStatus": "pending",
    "reciverStatus": "pending",
    "reqInitiator": "admin"}
 let {sender,...rest} = test
console.log(rest)