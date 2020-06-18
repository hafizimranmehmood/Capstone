var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const tokenName = "Paragon Peak Realty";
    const tokenSymbol = "PPR";

    const proofContents = {
    	"proof": {
        	"a": ["0x1712f3df6fe34b14425749815440245bccf988a5f23480df55467cdb719f1c60", "0x1c03dae310f826876d7f9943188fe32ed33237a8fcb63c1565a51a2d302cafcc"],
       		"b": [["0x0454f55a94b6fc869b066fb8d17cf41b83477b9be625557256587689c31e0d4c", "0x2e66a7daa7608f5827ee662ddc1b4b43c73d0b09c2fe0a96c59ec15e2d0e171d"], ["0x0b6c050b7f60c09bf2a5f860d105c22413918a1d98719d39af6b584692a0a5be", "0x2811ac3cae348545da1d48896843c9aa7d882e33a581ae77b5919c1243d57f4a"]],
        	"c": ["0x305d5cd97ab491e7529c20061ad58537cf91968f20bc0e44e42dc542d0367d93", "0x24a5d717a8643251b82638c07254d07c5205d8c4967779bcc01cfbe293811d73"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    }

    describe('SolnSquareVerifier tests', function () {
        before(async function () {
        	verifierContract = await Verifier.new({ from: account_one});
            this.contract = await SolnSquareVerifier.new(verifierContract.address, tokenName, tokenSymbol, { from: account_one });
        })

		// Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {

            let result = await this.contract.mintNFT(account_two, 2, proofContents.proof.a, proofContents.proof.b, proofContents.proof.c, proofContents.inputs);
            
            assert.equal(result.logs[1].event, "Transfer", "Unable to add a new solution");
        })

        it('Test if we can add same solution to the contract - SolnSquareVerifier', async function () {

        	let reverted = false;
        	try{
            	await this.contract.mintNFT(accounts[3], 3, proofContents.proof.a, proofContents.proof.b, proofContents.proof.c, proofContents.inputs);
            }catch(e)
            {
            	reverted = true;
            }

            assert.equal(reverted, true, "Same solution can not be added again");
        })

		// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
            await this.contract.mint(accounts[4], 4);
            let balance = await this.contract.balanceOf(accounts[4]);
            assert.equal(balance.toNumber(), 1, "balance should be 1");
        })

    })

})
