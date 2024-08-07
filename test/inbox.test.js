const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: evm.bytecode.object,
            arguments: ['Initial Message'],
        })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address);
    });

    it("has a default message", async () => {
        const message = await inbox.methods.getMessage().call();
        assert.equal(message, "Initial Message");
    });

    it("can change the message", async () => {
        await inbox.methods.setMessage("Updated Message").send({ from: accounts[0] });
        const message = await inbox.methods.getMessage().call();
        assert.equal(message, "Updated Message");
    });
});
