const VolumePricingTokenSale = artifacts.require("VolumePricingTokenSale");
const TokenContract = artifacts.require("WorkToken");
const rate = 166;
const volumeRate = 250;
const volumeThreshold = web3.toBigNumber(10).mul(10**18);
const saleTokenAllowance = web3.toBigNumber(10000).mul(10**18);
const gas = 2100000;

contract("VolumePricingTokenSale", function ([seller, buyer, proceeds]) {
    let instance;
    let tokenContract;
    beforeEach('setup contract for each test', async function () {
        tokenContract = await TokenContract.new();
        //console.log("Deployed Token contract at "+tokenContract.address);
        instance = await VolumePricingTokenSale.new(rate, volumeRate, volumeThreshold, 
                        proceeds, seller, tokenContract.address);
        //console.log("Deployed VolumePricingTokenSale contract at "+instance.address);
        //Approve an allowance to the sale contract so that it can issue tokens in the name of the seller
        assert.ok(await tokenContract.approve(instance.address, saleTokenAllowance), {from: seller});
    });
    it('allows buyer to purchase tokens at normal rate', async function () {
        tokenAmount = web3.toBigNumber(5).mul(10**18);
        assert.isBelow(tokenAmount.toNumber(), volumeThreshold.toNumber(), "Test amount " + tokenAmount + " is not below the volume treshold "+ volumeThreshold);
        weiAmount = tokenAmount.dividedToIntegerBy(rate);
        proceedsWeiBalance = web3.eth.getBalance(proceeds);
        web3.eth.sendTransaction({ from: buyer, to: instance.address, value: weiAmount, gas: gas});
        assert.equal(tokenAmount, (await tokenContract.balanceOf(buyer)).toNumber());
        proceedsNewWeiBalance = web3.eth.getBalance(proceeds);
        assert.equal(weiAmount.toNumber(), proceedsNewWeiBalance.sub(proceedsWeiBalance).toNumber());
    });
    it('allows buyer to purchase tokens at volume rate', async function () {
        tokenAmount = web3.toBigNumber(50).mul(10**18);
        assert.isAtLeast(tokenAmount.toNumber(), volumeThreshold.toNumber(), "Test amount "+tokenAmount+" does not meet volume threshold of "+volumeThreshold);
        weiAmount = tokenAmount.dividedBy(volumeRate);
        assert.ok(await instance.sendTransaction({from: buyer, gas: gas, value: weiAmount}));
        assert.equal(tokenAmount.toNumber(), (await tokenContract.balanceOf(buyer)).toNumber());
    });
});