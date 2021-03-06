// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');
    
contract('Verifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

	// - use the contents from proof.json generated from zokrates steps
    const proofContents = {
    	"proof": {
        	"a": ["0x1712f3df6fe34b14425749815440245bccf988a5f23480df55467cdb719f1c60", "0x1c03dae310f826876d7f9943188fe32ed33237a8fcb63c1565a51a2d302cafcc"],
        	"b": [["0x0454f55a94b6fc869b066fb8d17cf41b83477b9be625557256587689c31e0d4c", "0x2e66a7daa7608f5827ee662ddc1b4b43c73d0b09c2fe0a96c59ec15e2d0e171d"], ["0x0b6c050b7f60c09bf2a5f860d105c22413918a1d98719d39af6b584692a0a5be", "0x2811ac3cae348545da1d48896843c9aa7d882e33a581ae77b5919c1243d57f4a"]],
        	"c": ["0x305d5cd97ab491e7529c20061ad58537cf91968f20bc0e44e42dc542d0367d93", "0x24a5d717a8643251b82638c07254d07c5205d8c4967779bcc01cfbe293811d73"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    }

    describe('Verifier tests', function () {
        beforeEach(async function () {
            this.contract = await Verifier.new({ from: account_one });
        })

        // Test verification with correct proof

        it('Test verification with correct proof', async function () {
			
			let result = await this.contract.verifyTx.call(proofContents.proof.a, proofContents.proof.b, proofContents.proof.c, proofContents.inputs);
            assert.equal(result, true, "There is a problem in verification of the correct proof");



        })

		// Test verification with incorrect proof
        it('Test verification with incorrect proof', async function () {
            
            let result = await this.contract.verifyTx.call(proofContents.proof.a, proofContents.proof.b, proofContents.proof.c, [9,0]);
            assert.equal(result, false, "Incorrect proof should not be validated");
        })

    });
})
