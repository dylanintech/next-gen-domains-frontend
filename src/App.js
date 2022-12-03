import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from 'ethers';
import contractAbi from '../src/utils/contractABI.json';
import './styles/App.css';
import { networks } from '../src/utils/networks';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.business';
const CONTRACT_ADDRESS = '0x615283BBab60C7c5A304Bd0087cd12D082aF5cc8';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [domain, setDomain] = useState('');
  const [record, setRecord] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
	  try {
		  const { ethereum } = window;
		  
		  if(!ethereum) {
			  alert('Get MetaMask -> https://metamask.io/');
			  return;
		  }

		  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

		  console.log("Connected", accounts[0]);
		  setCurrentAccount(accounts[0]);
	  } catch (error) {
		  console.log(error);
	  }
  }

  const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
	  if(!ethereum) {
		  console.log("Make sure you have metamask!")
		  return;
	  } else {
		  console.log("Got the ethereum object", ethereum)
	  }

	  const accounts = await ethereum.request({ method: 'eth_accounts' });

	  if(accounts.length !== 0) {
		  const account = accounts[0];
		  console.log("Found an authorized account", account);
		  setCurrentAccount(account);
	  } else {
		  console.log("No authorized account found!");
	  }
  };
//   const mintDomain = async () => {
// 	  if(!domain) { return }
// 	  if(domain.length < 3) {
// 		  alert('Domain must be at least 3 characters long');
// 		  return;
// 	  }
// 	  const price = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
// 	  console.log("Minting domain", domain, "with price", price);

// 	  try {
//         const { ethereum } = window;
// 		if(ethereum) {
// 			const provider = new ethers.providers.Web3Provider(ethereum);
// 			const signer = provider.getSigner();
// 			const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
// 			console.log("Going to pop wallet now to pay gas...");
// 			let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
// 			const receipt = await tx.wait();
// 			if(receipt.status === 1) {
// 				console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);
// 				tx = await contract.setRecord(domain, record);
// 				await tx.wait();
// 				console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

// 				setRecord('');
// 				setDomain('');
// 			} else {
// 				alert("Transaction failed! Please try again");
// 			}
// 		} 
// 	  } catch(error) {
// 		  console.log(error);
// 	  }
//   }
const mintDomain = async () => {
	// Don't run if the domain is empty
	if (!domain) {
		return;
	}

	// Alert the user if the domain is too short
	if (domain.length < 3) {
		alert("Domain must be at least 3 characters long");
		return;
	}
	// Calculate price based on length of domain (change this to match your contract)
	// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
	const price = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
	console.log("Minting domain", domain, "with price", price);
	try {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

			console.log("Going to pop wallet now to pay gas...");
			let tx = await contract.register(domain, { value: ethers.utils.parseEther(price)});
			// Wait for the transaction to be mined
			const receipt = await tx.wait();

			// Check if the transaction was successfully completed
			if (receipt.status === 1) {
				console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash);

				// Set the record for the domain
				tx = await contract.setRecord(domain, record);
				await tx.wait();

				console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

				setRecord("");
				setDomain("");
			} else {
				alert("Transaction failed! Please try again");
			}
		}
	} catch (error) {
		console.log(error);
	}
};
  const renderNotConnectedContainter = () => {
    return (
		<div className='connect-wallet-container'> 
		  <img src='https://media.giphy.com/media/VkMV9TldsPd28/giphy.gif' alt='business gif'></img>
		  <button onClick={connectWallet} className='cta-button connect-wallet-button'>
            Connect Wallet
		  </button>
		</div>
	)
  };

  const renderInputForm = () => {
	  return (
		  <div className='form-container'>
			  <div className='first-row'>
				  <input 
				    type="text"
					value={domain}
					placeholder="domain"
                    onChange={e => setDomain(e.target.value)}
				  />
				  <p className='tld'>{tld}</p>
			  </div>

			  <input 
			    type="text"
				value={record}
				placeholder="LinkedIn link?"
				onChange={e => setRecord(e.target.value)}
			  />

			  <div className='button-container'>
				  <button onClick={mintDomain} className='cta-button mint-button' disabled={null}>
					  Mint domain
				  </button>
				  {/* <button className='cta-button mint-button' disabled={null} onClick={null}>
					  Connect your LinkedIn
				  </button> */}
			  </div>

		  </div>
	  )
  }

  useEffect(() => {
	  checkIfWalletIsConnected();
  }, []);

  return (
		<div className="App">
			<div className="container">

				<div className="header-container">
					<header>
            <div className="left">
              <p className="title">💼 Business Name Service</p>
              <p className="subtitle">Business cards on the blockchain!</p>
            </div>
					</header>
				</div>
				{!currentAccount && renderNotConnectedContainter()}
				{currentAccount && renderInputForm()}

        <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built by Dylan Molina with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;
