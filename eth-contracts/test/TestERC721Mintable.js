var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('CustomERC721Token', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    
    const tokenName = "Paragon Peak Realty";
    const tokenSymbol = "PPR";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(tokenName, tokenSymbol, {from: account_one});

            // TODO: mint multiple tokens
            for(let i = 1; i <= 10; i ++){
                await this.contract.mint(accounts[i], i, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.strictEqual(totalSupply.toNumber(), 10, "Count of total supply should be 10");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(accounts[1]);
            assert.strictEqual(balance.toNumber(), 1, "Balance of this account should be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI(1);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Invalid Token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, accounts[1], "Not a token owner");
            await this.contract.transferFrom(accounts[1], accounts[2], 1, {from: accounts[1]}) 
            let newOwner = await this.contract.ownerOf(1);
            assert.equal(newOwner, accounts[2], "incorrect Owner");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new(tokenName, tokenSymbol, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let reverted = false;
            try{
                await this.contract.mint(accounts[1], 1, "token", {from: accounts[1]});
            }
            catch(err)
            {
                reverted = true;
            }
            assert.equal(reverted, true, "Expected revert");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_one, "Not a contract Owner");
        })

    });
})