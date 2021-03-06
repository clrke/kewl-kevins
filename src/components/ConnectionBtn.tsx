import React, { useContext, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import '../App.css';

import {
  chainId,
  chainName,
  currencyName,
  currencySymbol,
  rpcUrl,
  blockExplorerUrl,
} from '../constants/moralisConstants';
import { useMoralis } from 'react-moralis';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { useMetaMask } from 'metamask-react';

const PathContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CardListInnerContainer = styled.div`
    display: flex;
    flex: 1,
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`;

const CardListContainer = styled.div`
  width: 80%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const WalletAddressContainer = styled.div`
  display: flex;
  flex: 1;
  align-self: flex-start;
`;

const WalletAddressText = styled.p`
  display: flex;
  height: 50px;
  color: #fff;
  padding: 0 10px 0 10px;
  align-items: center;
  font-size: 18px;
  border-radius: 10px;
  background-color: #000;
`;

export default function ConnectionBtn() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    logout,
    Moralis,
    account,
  } = useMoralis();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const metamask = useMetaMask();

  const SwitchNetwork = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        await Moralis.switchNetwork(chainId);
      } catch (error: any) {
        try {
          await Moralis.addNetwork(
            chainId,
            chainName,
            currencyName,
            currencySymbol,
            rpcUrl,
            blockExplorerUrl
          );
          await Moralis.switchNetwork(chainId);
        } catch (error: any) {
          console.log(error);
        }
      }
    } else {
      alert(
        'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
      );
    }
  };

  const chainIdSlice = (chainId: string) => {
    const wallet = `${chainId.slice(0, 5)}...${chainId.slice(
      chainId.length - 4,
      chainId.length
    )}`;
    setWalletAddress(wallet);
  };

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          SwitchNetwork();
          console.log('logged in user:', user);
          chainIdSlice(user!.get('ethAddress'));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async () => {
    await logout();
    console.log('logged out');
  };

  function handleGetUser() {
    console.log(metamask);
    if (metamask.account) {
      chainIdSlice(metamask.account);
    }
  }

  useEffect(() => {
    let isMount = true;

    if (isMount) {
      // TODO wallet address'
      handleGetUser();
    }

    return () => {
      isMount = false;
    };
  }, [metamask.status]);

  return (
    <PathContainer>
      <CardListContainer>
        {isAuthenticated && (
          <WalletAddressContainer>
            <WalletAddressText>
              Wallet:{' '}
              {metamask.status === 'initializing'
                ? 'Initializing'
                : metamask.status === 'connected'
                ? walletAddress
                : 'Not Connected'}
            </WalletAddressText>
          </WalletAddressContainer>
        )}
      </CardListContainer>

      <button
        className="game-button-box"
        onClick={isAuthenticated ? () => {} : login}
      >
        {isAuthenticated ? 'MINT' : 'CONNECT WALLET'}
      </button>
      <button
        className="game-button-box"
        onClick={logOut}
        disabled={isAuthenticating}
      >
        LOGOUT
      </button>
    </PathContainer>
  );
}
