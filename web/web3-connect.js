//const { default: Web3 } = require("web3");

var account;
var nDecimal;
var sSymbol;
$(document).ready(async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        alert("Metamask is ready");
    } else {
        alert("Metamask not found")
    }

    window.contract = await loadContract(); // getting or initializing contract instance
    console.log(window.contract);

    account = await getCurrentAccount(); // getting contract deployer's account (using Ropstan here)
    console.log(account);

    $("#account").html(account);

    var sName = await window.contract.methods.name().call(); // ** getting Token Name
    sSymbol = await window.contract.methods.symbol().call(); // ** getting Token Symbol
    var nTotalSupply = await window.contract.methods.totalSupply().call(); // ** getting total supply
    nDecimal = await window.contract.methods.decimals().call(); // ** getting Token decimals



    var nTotalAvailability = await window.contract.methods.balanceOf(account).call(); // getting balance of owner
    $("#availableSupply").html(`=> ${Number(nTotalAvailability / (10**nDecimal))}` + ` ${sSymbol}`);

    console.log(sName, sSymbol, nDecimal, totalSupply, nTotalAvailability);

    $("#tokenName").html(sName); // setting token name 
    $("#tokenSymbol").html(sSymbol); // setting token symbol
    $("#decimals").html(nDecimal); // setting decimals
    $("#totalSupply").html(`=> ${Number(nTotalSupply / (10**nDecimal))}` + ` ${sSymbol}`); // setting total supply
});

$("#checkGasButton").on('click', async () => {
    try {
        var gasLimit = $("#gasLimitInput").val();
        var gasPrice = $("#gasPriceInput").val();
        var result = await window.contract.methods.balanceOf(account).estimateGas({
            from: account
        });

        console.log("Result ==> ", result);
    } catch (error) {
        $("#gasResult").html("---> Transaction failed!").css('color', 'red');
    }
});

// button action listener
$("#sendTo").on('click', async () => {
    try {
        let nGasPrice = await web3.utils.toWei('2', 'gwei')
        console.log('Gwei ==>> ', nGasPrice);

        $("#sendRes").html("Transaction is processing...").css('color', 'blue');
        var recAddress = $("#recInput1").val();
        var amount = BigInt($("#amtInput1").val() * (10 ** nDecimal));
        console.log(amount);

        await window.contract.methods.transfer(recAddress, amount).estimateGas({
            from: account
        }, async (error, estimatedGas) => {
            if (estimatedGas) {
                console.log("Estimate Gas of TransferTo Result ==>> ", estimatedGas);
                await window.contract.methods.transfer(recAddress, amount).send({
                        from: account,
                        gas: estimatedGas, // setting 'gas limit'
                        gasPrice: nGasPrice // setting 'Gas Price (in Gwei)'
                    })
                    .on('error', () => {
                        $("#sendRes").html("---> Transaction failed!").css('color', 'red');
                    })
                    .then(() => {
                        console.log("transferTo Result ==> ", result);
                        $("#sendRes").html("---> Transaction successfull").css('color', 'green');
                    });
            } else {
                console.log("Estimate Gas of TransferTo **Error** ==>> ", result);
            }
        });
    } catch (error) {
        console.log('Error ==> ', error);
        $("#sendRes").html("---> Transaction failed!").css('color', 'red');
    }
});

$("#sendFrom").on('click', async () => {
    try {
        let nGasPrice = await web3.utils.toWei('2', 'gwei')
        console.log('Gwei <<<<===>>>> ', nGasPrice);

        $("#sendFromRes").html("transaction processing...").css('color', 'blue');
        var ownerAddress = $("#ownerInput1").val();
        var recAddress = $("#recInput2").val();
        var amount = BigInt($("#amtInput2").val() * (10 ** nDecimal));

        var account = await getCurrentAccount();
        console.log("SEND FROM ====> ", account);

        await window.contract.methods.transfer(recAddress, amount).estimateGas({
            from: account
        }, async (error, estimatedGas) => {
            if (estimatedGas) {
                console.log("Estimate Gas of TransferFrom Result ==>> ", estimatedGas);
                await window.contract.methods.transferFrom(ownerAddress, recAddress, amount).send({
                        from: account,
                        gas: estimatedGas,
                        gasPrice: nGasPrice
                    })
                    .on('error', () => {
                        $("#sendFromRes").html("---> Transaction failed!").css('color', 'red');
                    })
                    .then(() => {
                        $("#sendFromRes").html("---> Transaction success").css('color', 'green');
                    });
            } else {
                console.log("Estimate Gas of TransferFrom **Error** ==>> ", error);
            }
        });
    } catch (error) {
        console.log(error);
        $("#sendFromRes").html("catch---> Transaction failed!").css('color', 'red');
    }
});

$("#Approve").on('click', async () => {
    try {
        let nGasPrice = await web3.utils.toWei('2', 'gwei')
        console.log('Gwei <<<<===>>>> ', nGasPrice);

        $("#approveResult").html("Transaction processing...").css('color', 'blue');
        var receiver = $("#recInput3").val();
        var amount = BigInt($("#amtInput3").val() * (10 ** nDecimal));

        await window.contract.methods.approve(receiver, amount).estimateGas({
            from: account
        }, async (error, estimatedGas) => {
            if (estimatedGas){
                console.log("Estimate Gas of Approve **Result** ==>> ", estimatedGas);
                await window.contract.methods.approve(receiver, amount).send({
                    from: account,
                    gas: estimatedGas,
                    gasPrice: nGasPrice
                }).on('error', function () {
                    $("#approveResult").html("---> Transaction failed!").css('color', 'red');
                })
                .then(function () {
                    alert(`Tokens has been Approved to ${receiver}`);
                    $("#approveResult").html("---> Transaction successfull").css('color', 'green');
                });
            }
        });

        var result = await window.contract.methods.approve(receiver, amount).send({
                from: account
            }).on('error', function () {
                $("#approveResult").html("---> Transaction failed!").css('color', 'red');
            })
            .then(function () {
                alert(`Tokens has been Approved to ${receiver}`);
                $("#approveResult").html("---> Transaction successfull").css('color', 'green');
            });
    } catch (err) {
        $("#approveResult").html("---> Transaction failed!").css('color', 'red');
    }
});

$("#Allowence").on('click', async () => {
    try {
        let nGasPrice = await web3.utils.toWei('2', 'gwei')
        console.log('Gwei <<<<===>>>> ', nGasPrice);

        $("#allowences").html("---> Transaction pending...");
        var owner = $("#ownerInput2").val();
        var receiver = $("#recInput4").val();

        // TODO: add logic of Gas Estimation

        await window.contract.methods.allowence(owner, receiver).estimateGas({
            from: account
        }, async (error, estimatedGas) => {
            if (estimatedGas) {
                console.log("Estimate Gas of Allownece ==>> ", estimatedGas);
                await window.contract.methods.allowence(owner, receiver).call({
                    from: account,
                    gas: estimatedGas,
                    gasPrice: nGasPrice
                })
                .then((result) => {
                    $("#allowences").html(`Allowence : ${Number(result/(10**nDecimal))} TBC`);
                });
            }
        });

        // var result = await window.contract.methods.allowence(owner, receiver).call()
        //     .then((result) => {
        //         $("#allowences").html(`Allowence : ${Number(result/(10**nDecimal))} TBC`);
        //     });

    } catch (error) {
        console.log("Error ==>> ", error);
        $("#allowences").html(`---> Transaction failed!`).css('color', 'red');
    }
});

$("#checkBalance").on('click', async () => {
    try {

        let nGasPrice = await web3.utils.toWei('2', 'gwei')
        console.log('Gwei <<<<===>>>> ', nGasPrice);

        $("#resultBalance").html("---> Transaction pending...").css('color', 'blue');
        var owner = $("#address").val();

        await window.contract.methods.balanceOf(owner).estimateGas({
            from: account
        }, async (error, estimatedGas) => {
            if(estimatedGas){
                await window.contract.methods.balanceOf(owner).call({
                    from: account,
                    gas: estimatedGas,
                    gasPrice: nGasPrice
                })
                .then(async (result) => {
                    setTimeout(() => {
                        $("#resultBalance").html(`Balance : ${Number(result/(10**nDecimal))} TBC`).css('color', 'green');
                    }, 1500);
                    $("#resultBalance").html("---> Transaction succesfull").css('color', 'green');
                });
            }
        });       
    } catch (err) {
        console.log("Error =====>> ", err);
        $("#resultBalance").html("---> Transaction failed!").css('color', 'red');
    }
});

ethereum.on('chainChanged', async () => {
    await document.location.reload();
});

async function getCurrentAccount() {
    if (window.ethereum) {
        await ethereum.enable();
    }
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function loadContract() {

    // contract ABI
    const ABI = [{
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": false,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": false,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "_totalSupply",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                }
            ],
            "name": "allowence",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                "internalType": "address",
                "name": "_tokenOwner",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const contractAddress = "0x2B6143aFa0863e36eE7de8AB4E781D8920ad8cA6"; //contract address
    return await new window.web3.eth.Contract(ABI, contractAddress);
}
