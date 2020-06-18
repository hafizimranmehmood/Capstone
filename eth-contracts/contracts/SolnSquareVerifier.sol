pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";
import "./ERC721Mintable.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {


	// TODO define a solutions struct that can hold an index & an address
	struct Solution {
        uint index;
        address _address;
    }

	// TODO define an array of the above struct
	// Solutions[] solutions;
	mapping (address => Solution) solutions;

	// TODO define a mapping to store unique solutions submitted
	mapping (bytes32 => Solution) uniqueSolutions;

	// TODO Create an event to emit when a solution is added
	event SolutionAdded(uint index, address _address);

	Verifier public verifierContract;

	constructor(address _verifierContract, string memory name, string memory symbol) CustomERC721Token(name, symbol) 
		public 
	{
		verifierContract = Verifier(_verifierContract);
	}


	// TODO Create a function to add the solutions to the array and emit the event
	function addSolution(address _address, uint _index, bytes32 _key) public {
        Solution memory solution = Solution(
        	_index,
            _address
        );
        solutions[_address] = solution;
        uniqueSolutions[_key] = solution;
        emit SolutionAdded(_index, _address);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
	//  - make sure the solution is unique (has not been used before)
	//  - make sure you handle metadata as well as tokenSuplly

    function mintNFT(address to, uint256 tokenId, 
    	uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input)
    	public returns(bool) 
    {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[key]._address == address(0), "Solution already exists");
        require(verifierContract.verifyTx(a, b, c, input), "Unable to verify the solution");
        addSolution(to, tokenId, key);        
        return super.mint(to, tokenId);

    }
}
  


























