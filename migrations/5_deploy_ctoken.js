const utils = require('./utils')
const Unitroller = artifacts.require("Unitroller")
const ComptrollerG4 = artifacts.require("ComptrollerG4")
const CErc20 = artifacts.require("CErc20")
const CErc20Delegate = artifacts.require("CErc20Delegate")
const CErc20Delegator = artifacts.require("CErc20Delegator")


CERC20_DELEGATE = "cerc20_delegate"
CERC20_DELEGATOR_USDT = "cerc20_delegator_usdt"
const toWei = web3.utils.toWei


module.exports = async function (deployer, network, accounts) {
    console.log("5_deploy_ctoken.js, network: ", network)
    let deployedConfig = utils.getConfigContractAddresses();
    let config = utils.getContractAddresses();
    
    if (network == "main_fork") {
        deployedConfig = deployedConfig["mainnet"]
        config = config[network]
        // deploy CErc20Delegate
        let cerc20Admin = accounts[0];
        await deployer.deploy(CErc20Delegate, {from: cerc20Admin});
        config[CERC20_DELEGATE] = CErc20Delegate.address
        
        // deploy usdt through CErc20Delegator
        await deployer.deploy(CErc20Delegator, 
            deployedConfig.usdt,
            config.unitroller,
            config.usdt_interest_rate_model.address,
            deployedConfig.cusdt.initial_exchange_rate_mantissa,
            deployedConfig.cusdt.name,
            deployedConfig.cusdt.symbol,
            deployedConfig.cusdt.decimals,
            cerc20Admin,
            CErc20Delegate.address,
            '0x0', {from: cerc20Admin});
        config[CERC20_DELEGATOR_USDT] = CErc20Delegator.address

        // save config
        utils.writeContractAddresses(config);

    } else {
        return
    }
    
    


}