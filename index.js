var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
var Eth = require('ethjs')
window.Eth = Eth

var fs = require('fs')
var terms = fs.readFileSync(__dirname + '/terms.txt').toString()

connectButton.addEventListener('click', function () {
  connect()
})

function connect () {
  if (typeof ethereum !== 'undefined') {
    ethereum.enable()
    .catch(console.error)
  }
}

ethSignButton.addEventListener('click', function(event) {
  event.preventDefault()
  var msg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
  var from = web3.eth.accounts[0]
  if (!from) return connect()
  web3.eth.sign(from, msg, function (err, result) {
    if (err) return console.error(err)
    console.log('SIGNED:' + result)
  })
})

personalSignButton.addEventListener('click', function(event) {
  event.preventDefault()
  var text = terms
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  // var msg = '0x1' // hexEncode(text)
  console.log(msg)
  var from = web3.eth.accounts[0]
  if (!from) return connect()

  /*  web3.personal.sign not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3.personal.sign(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

   console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msg, from]
  var method = 'personal_sign'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) return console.error(result.error)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    console.log('recovering...')
    const msgParams = { data: msg }
    msgParams.sig = result.result
    console.dir({ msgParams })
    const recovered = sigUtil.recoverPersonalSignature(msgParams)
    console.dir({ recovered })

    if (recovered === from ) {
      console.log('SigUtil Successfully verified signer as ' + from)
    } else {
      console.dir(recovered)
      console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
      console.log('Failed, comparing %s to %s', recovered, from)
    }


    /*
    method = 'personal_ecRecover'
    var params = [msg, result.result]
    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, recovered) {
      console.dir({ err, recovered })
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)

      if (result.result === from ) {
        console.log('Successfully verified signer as ' + from)
      } else {
        console.log('Failed to verify signer when comparing ' + result.result + ' to ' + from)
      }

    })
    */
  })

})


personalRecoverTest.addEventListener('click', function(event) {
  event.preventDefault()
  var text = 'hello!'
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  // var msg = '0x1' // hexEncode(text)
  console.log(msg)
  var from = web3.eth.accounts[0]
  if (!from) return connect()

  /*  web3.personal.sign not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3.personal.sign(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

   console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msg, from]
  var method = 'personal_sign'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) return console.error(result.error)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    console.log('recovering...')
    const msgParams = { data: msg }
    msgParams.sig = result.result

    method = 'personal_ecRecover'
    var params = [msg, result.result]
    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      var recovered = result.result
      console.log('ec recover called back:')
      console.dir({ err, recovered })
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)


      if (recovered === from ) {
        console.log('Successfully ecRecovered signer as ' + from)
      } else {
        console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
      }

    })
  })

})

ethjsPersonalSignButton.addEventListener('click', function(event) {
  event.preventDefault()
  var text = terms
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  var from = web3.eth.accounts[0]
  if (!from) return connect()

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [from, msg]

  // Now with Eth.js
  var eth = new Eth(web3.currentProvider)

  eth.personal_sign(msg, from)
  .then((signed) => {
    console.log('Signed!  Result is: ', signed)
    console.log('Recovering...')

    return eth.personal_ecRecover(msg, signed)
  })
  .then((recovered) => {

    if (recovered === from) {
      console.log('Ethjs recovered the message signer!')
    } else {
      console.log('Ethjs failed to recover the message signer!')
      console.dir({ recovered })
    }
  })
})


signTypedDataButton.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi, Alice!'
    },
    {
      type: 'uint32',
      name: 'A number',
      value: '1337'
    }
  ]

  var from = web3.eth.accounts[0]
  if (!from) return connect()

  /*  web3.eth.signTypedData not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3.eth.signTypedData(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

   console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msgParams, from]
  console.dir(params)
  var method = 'eth_signTypedData'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error(result)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignatureLegacy({ data: msgParams, sig: result.result })

    if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }

  })

})

signTypedDataV3Button.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = JSON.stringify({types:{
    EIP712Domain:[
      {name:"name",type:"string"},
      {name:"version",type:"string"},
      {name:"chainId",type:"uint256"},
      {name:"verifyingContract",type:"address"}
    ],
    Person:[
      {name:"age",type:"uint64"},
      {name:"name",type:"string"},
      {name:"wallet",type:"address"}
    ],
    Mail:[
      {name:"from",type:"Person"},
      {name:"to",type:"Person"},
      {name:"contents",type:"string"},
      {name: "id", type: "uint256"},
    ]
  },
  primaryType:"Mail",
  domain:{name:"Ether Mail",version:"1",chainId:1,verifyingContract:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},
  message:{
    from:{age: 46,name:"Cow",wallet:"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},
    to:{age: 445711732, name:"Bob",wallet:"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},
    contents:"Hello, Bob!",
    id: "18446744073709551617"}
  })



  var from = web3.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
  var params = [from, msgParams]
  console.dir(params)
  var method = 'eth_signTypedData_v3'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error('ERROR', result)
    console.log('TYPED SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })

    if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }

  })
})

signTypedDataDicetherButton.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = JSON.stringify({
    "types": {
      "EIP712Domain": [{"name": "name", "type": "string"}, {
        "name": "version",
        "type": "string"
      }, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}],
      "Bet": [{"name": "roundId", "type": "uint32"}, {"name": "gameType", "type": "uint8"}, {
        "name": "number",
        "type": "uint256"
      }, {"name": "value", "type": "uint256"}, {"name": "balance", "type": "int256"}, {
        "name": "serverHash",
        "type": "bytes32"
      }, {"name": "userHash", "type": "bytes32"}, {"name": "gameId", "type": "uint256"}]
    },
    "primaryType": "Bet",
    "domain": {
      "name": "Dicether",
      "version": "2",
      "chainId": 1,
      "verifyingContract": "0xaEc1F783B29Aab2727d7C374Aa55483fe299feFa"
    },
    "message": {
      "roundId": 1,
      "gameType": 4,
      "num": 1,
      "value": "320000000000000",
      "balance": "0",
      "serverHash": "0x4ed3c2d4c6acd062a3a61add7ecdb2fcfd988d944ba18e52a0b0d912d7a43cf4",
      "userHash": "0x6901562dd98a823e76140dc8728eca225174406eaa6bf0da7b0ab67f6f93de4d",
      "gameId": 2393,
      "number": 1
    }
  });

  var from = web3.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
  var params = [from, msgParams]
  console.dir(params)
  var method = 'eth_signTypedData_v3'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error('ERROR', result)
    console.log('TYPED SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })

    if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }

  })
})

trustWalletBug.addEventListener('click', function(event) {
  event.preventDefault()

  const typedData = {
    types:{
      EIP712Domain:[],
      Test:[
        {name: "test", type: "uint256"}
      ],
    },
    primaryType:"Test",
    domain: {},
    message: {
      //test: "57896044618658097711785492504343953926634992332820282019728792003956564819967", // OK: 2^255 - 1
        test: "57896044618658097711785492504343953926634992332820282019728792003956564819968", // fails: 2^255
    },
  };

  var msgParams = JSON.stringify(typedData);

  var from = web3.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
  var params = [from, msgParams]
  console.dir(params)
  var method = 'eth_signTypedData_v3'

  web3.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error('ERROR', result)
    console.log('TYPED SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })
    const hash = ethUtil.bufferToHex(sigUtil.TypedDataUtils.sign(typedData));

    if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
      alert('Successfully ecRecovered signer as ' + from + "\nStructured data hash:\n" + hash)
    } else {
      alert('Failed to verify signer when comparing ' + recovered + ' to ' + from + "\nStructured data hash:\n" + hash);
    }
  })
})

ethjsSignTypedDataButton.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi, Alice!'
    },
    {
      type: 'uint32',
      name: 'A number',
      value: '1337'
    }
  ]

  var from = web3.eth.accounts[0]
  if (!from) return connect()

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msgParams, from]

  var eth = new Eth(web3.currentProvider)

  eth.signTypedData(msgParams, from)
  .then((signed) => {
    console.log('Signed!  Result is: ', signed)
    console.log('Recovering...')

    const recovered = sigUtil.recoverTypedSignature({ data: msgParams, sig: signed })

    if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + signed + ' to ' + from)
    }

  })
})
