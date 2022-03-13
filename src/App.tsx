import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import styled, { css, keyframes } from 'styled-components';
import useTiles, { Tile, TileSpecial, TileType } from './hooks/useTiles';
import GameObjects from './components/GameObjects';
import useSound from 'use-sound';
import startGameSfx from './audio/startGameSfx.mp3';
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import obstacleBumpSfx from './audio/obstacleBumpSfx.mp3';
import { TILE_SIZE } from "./constants/tiles";
import Direction from "./components/Direction";
import {
  KK_CONTRACT_ABI,
  KK_CONTRACT_ADDRESS,
  KKP_CONTRACT_ABI,
  KKP_CONTRACT_ADDRESS
} from "./constants/moralisConstants";
import Puzzle from "./models/Puzzle";
import KewlKevin from "./models/KewlKevin";

interface ContainerProps {
  shaking: boolean;
}

const shakeAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(0, -5px);
  }
  20% {
    transform: translate(0, 5px);
  }
  30% {
    transform: translate(0, -5px);
  }
  40% {
    transform: translate(0, 5px);
  }
  50% {
    transform: translate(0, -5px);
  }
  60% {
    transform: translate(0, 5px);
  }
  70% {
    transform: translate(0, -5px);
  }
  80% {
    transform: translate(0, 5px);
  }
  90% {
    transform: translate(0, -5px);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const Container = styled.div<ContainerProps>`
  color: white;
  ${(props) =>
          props.shaking &&
          css`
            animation: ${shakeAnimation} 0.5s linear;
          `}
`;

const TileRow = styled.div`
  white-space: nowrap;
  line-height: 0;
`;

interface BorderTileProps {
  special?: TileSpecial;
}

const BorderTile = styled.div<BorderTileProps>`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  display: inline-block;
  position: relative;
  background-color: #000;

  ${(props) =>
          props.special === TileSpecial.ENTRANCE && `background-color: #ff8;`}
  ${(props) => props.special === TileSpecial.EXIT && `background-color: #8f8;`}
`;

const PlainTile = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  display: inline-block;
  position: relative;
  background-color: #fff;
`;

interface PlainTileSpotProps {
  position: { x: number; y: number };
  special?: TileSpecial;
}

const PlainTileSpot = styled.div.attrs((props: PlainTileSpotProps) => ({
  style: {
    top: `${props.position.x}px`,
    left: `${props.position.y}px`,
  },
}))<PlainTileSpotProps>`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background-color: #eee;
`;


const ConnectButtonContainer = styled.div`
  flex: 1;
  padding-top: 24px;
  padding-left: 24px;
  padding-bottom: 24px;
`;

const BlueButton = styled.button`
  margin-top: 8px;
  margin-bottom: 24px;
  padding: 8px;
  border: none;
  background-color: #B1D0E0;
  color: #416983;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.5s ease-in-out;

  :hover {
    background-color: #61dafb;
  }
`;

const ChooseNftContainer = styled.div`
  margin: 48px;
`;

const KewlKevinContainer = styled.div`
  cursor: pointer;
  padding: 24px;
  display: inline-block;

  :hover {
    box-shadow: 0 0 8px 0 rgba(255, 184, 5, 1);
  }
`;

const KewlKevinPuzzleContainer = styled.div`
  cursor: pointer;
  padding: 24px;
  display: inline-block;
  background-color: deepskyblue;
  transition: background-color 0.2s ease-in-out;

  :hover {
    background-color: aqua;
  }
`;

function App() {
  const { authenticate, isAuthenticated, isAuthenticating, Moralis } = useMoralis();
  const web3 = useWeb3ExecuteFunction();
  const [web3Provider, setWeb3Provider] = useState<any>(null);

  const [nfts, setNfts] = useState<KewlKevin[] | undefined>(undefined);
  const [puzzles, setPuzzles] = useState<Puzzle[] | undefined>(undefined);
  const [nft, setNft] = useState<KewlKevin | undefined>(undefined);
  const [puzzleId, setPuzzleId] = useState<number | undefined>(undefined);

  const { tiles, obstacles, end } = useTiles(Moralis, puzzleId);
  const [gameStarted, setGameStarted] = useState(false);
  const [shaking, setShaking] = useState(false);

  const topLeft = useRef<HTMLDivElement>(null);
  const topRight = useRef<HTMLDivElement>(null);
  const bottomLeft = useRef<HTMLDivElement>(null);
  const bottomRight = useRef<HTMLDivElement>(null);
  const entrance = useRef<HTMLDivElement>(null);
  const exit = useRef<HTMLDivElement>(null);
  const [playStartGameSfx] = useSound(startGameSfx);
  const [playObstacleBumpSfx] = useSound(obstacleBumpSfx);

  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [maxSupply, setMaxSupply] = useState<number | null>(null);

  function scrollTo(ref: React.RefObject<HTMLDivElement>) {
    const e = ref.current!;
    window.scroll(
      e.offsetLeft - window.innerWidth / 2,
      e.offsetTop - window.innerHeight / 2
    );
  }

  async function refreshMintSupplies() {
    if (web3Provider) {
      setTotalSupply(+(await Moralis.executeFunction({
        contractAddress: KK_CONTRACT_ADDRESS,
        functionName: "totalSupply",
        abi: KK_CONTRACT_ABI,
      })))
      setMaxSupply(+(await Moralis.executeFunction({
        contractAddress: KK_CONTRACT_ADDRESS,
        functionName: "MAX_SUPPLY",
        abi: KK_CONTRACT_ABI,
      })));
    }
  }

  useEffect(() => {
    (async () => {
      await refreshMintSupplies();
    })();
  }, [web3Provider]);

  const mintNft = async () => {
    await web3.fetch({
      params: {
        contractAddress: KK_CONTRACT_ADDRESS,
        functionName: "mintNFT",
        abi: KK_CONTRACT_ABI,
        msgValue: Moralis.Units.ETH(10),
      },
      onComplete: async () => {
        alert("Please wait for your transaction to finish then refresh the page to have your puzzle be reflected.");
      }
    });
  }

  const mintPuzzleNft = async () => {
    await web3.fetch({
      params: {
        contractAddress: KKP_CONTRACT_ADDRESS,
        functionName: "mint",
        abi: KKP_CONTRACT_ABI,
        msgValue: Moralis.Units.ETH(8),
      },
      onComplete: async () => {
        alert("Please wait for your transaction to finish then refresh the page to have your puzzle be reflected.");
      }
    });
  }

  useEffect(() => {
    (async () => {
      const newWeb3Provider = await Moralis.enableWeb3();
      if (newWeb3Provider) {
        const network = await newWeb3Provider.detectNetwork();
        if (network.name !== "matic") {
          alert("Please connect to the Polygon network.");
          await Moralis.deactivateWeb3();
          return;
        }
        setWeb3Provider(newWeb3Provider);
      }
    })();
  }, []);

  useEffect(() => {
    if (!web3Provider) return;
    (async () => {
      const NFTs = await Moralis.Web3API.account.getNFTsForContract({
        address: "",
        token_address: KK_CONTRACT_ADDRESS,
        chain: "polygon",
      });
      setNfts(NFTs.result!.map(nft => {
        const metadata = JSON.parse(nft.metadata!);
        if (!metadata) return new KewlKevin(0, {}, null);

        return new KewlKevin(+nft.token_id, metadata, metadata.image);
      }).filter(nft => nft.tokenId > 0));
      const puzzles = await Moralis.Web3API.account.getNFTsForContract({
        address: "",
        token_address: KKP_CONTRACT_ADDRESS,
        chain: "polygon",
      });
      setPuzzles(puzzles.result!.map(puzzle => {
        return new Puzzle(+puzzle.token_id);
      }));
    })();
  }, [Moralis, web3Provider]);

  useEffect(() => {
    const scrolls = [
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
      exit,
      entrance,
    ];

    if (scrolls.filter((x) => !x.current).length) {
      return;
    }

    function scrollAndScroll(scrollIndex: number, lastCallback: () => void) {
      scrollTo(scrolls[scrollIndex]);
      if (scrollIndex === scrolls.length - 1) {
        return setTimeout(lastCallback, 1000);
      }
      setTimeout(() => scrollAndScroll(scrollIndex + 1, lastCallback), 1000);
    }

    scrollAndScroll(0, () => setGameStarted(true));
  }, [tiles, topRight, bottomRight, bottomLeft, topLeft, exit, entrance]);

  useEffect(() => {
    if (!gameStarted) return;
    playStartGameSfx();
  }, [playStartGameSfx, gameStarted])

  function screenShake() {
    setShaking(true);
    playObstacleBumpSfx();
    setTimeout(() => setShaking(false), 500);
  }

  async function rewardPlayer(movements: Direction[]) {
    console.log("You won!");
    console.log(puzzleId, movements.length, movements);
    await Moralis.executeFunction({
      contractAddress: KKP_CONTRACT_ADDRESS,
      functionName: "burnAndClaimReward",
      abi: KKP_CONTRACT_ABI,
      params: {
        tokenId: puzzleId,
        movements,
      },
    });
    setShaking(true);
    playStartGameSfx();
    setTimeout(() => setShaking(false), 500);
  }

  function getRef(tile: Tile) {
    switch (tile.special) {
      case TileSpecial.TOPLEFT:
        return topLeft;
      case TileSpecial.TOPRIGHT:
        return topRight;
      case TileSpecial.BOTTOMLEFT:
        return bottomLeft;
      case TileSpecial.BOTTOMRIGHT:
        return bottomRight;
      case TileSpecial.ENTRANCE:
        return entrance;
      case TileSpecial.EXIT:
        return exit;
      default:
        return null;
    }
  }

  return (
    <Container shaking={shaking}>
      {!nft && (
        <ChooseNftContainer>
          <h1>Choose your Kewl Kevin:</h1>
          <ConnectButtonContainer>
            {isAuthenticated ? (
              <BlueButton onClick={mintNft}>Mint ({totalSupply || "..."} / {maxSupply || "..."})</BlueButton>
            ) : (
              isAuthenticating ? (
                <BlueButton disabled>Authenticating...</BlueButton>
              ) : (
                <BlueButton onClick={() => authenticate({ signingMessage: "Welcome to Kewl Kevin" })}>
                  Connect Wallet
                </BlueButton>
              )
            )}
          </ConnectButtonContainer>
          {isAuthenticated && nfts && (
            <div>
              {nfts.length ? nfts.map(nft => (
                <KewlKevinContainer key={nft.tokenId} onClick={() => setNft(nft)}>
                  <img src={nft.image} alt={nft.tokenId.toString()} />
                </KewlKevinContainer>
              )) : (
                <div>
                  Looks like you don't have any Kewl Kevins. Mint from the button above, or buy one
                  from third-party marketplaces like OpenSea.
                </div>
              )}
            </div>
          )}
        </ChooseNftContainer>
      )}
      {nft && !puzzleId && (
        <ChooseNftContainer>
          <h1>Choose your Puzzle:</h1>
          <ConnectButtonContainer>
            {isAuthenticated ? (
              <BlueButton onClick={mintPuzzleNft}>Mint</BlueButton>
            ) : (
              isAuthenticating ? (
                <BlueButton disabled>Authenticating...</BlueButton>
              ) : (
                <BlueButton onClick={() => authenticate({ signingMessage: "Welcome to Kewl Kevin" })}>
                  Connect Wallet
                </BlueButton>
              )
            )}
          </ConnectButtonContainer>
          {isAuthenticated && puzzles && (
            <div>
              {puzzles.length ? puzzles.map(puzzle => (
                <KewlKevinPuzzleContainer key={puzzle.tokenId} onClick={() => setPuzzleId(puzzle.tokenId)}>
                  {puzzle.tokenId}
                </KewlKevinPuzzleContainer>
              )) : (
                <div>
                  Looks like you don't have any Puzzles yet. Mint from the button above.
                </div>
              )}
            </div>
          )}
        </ChooseNftContainer>
      )}
      {nft && tiles && end && obstacles && (
        <GameObjects
          gameStarted={gameStarted}
          obstacles={obstacles}
          end={end}
          nft={nft}
          screenShake={screenShake}
          rewardPlayer={rewardPlayer}
        />
      )}
      {tiles &&
        tiles.map((row, j) => (
          <TileRow key={j}>
            {row.map((tile, i) =>
              tile.type === TileType.PLAIN ? (
                <PlainTile key={i}>
                  <PlainTileSpot position={tile.spot} ref={getRef(tile)} />
                </PlainTile>
              ) : (
                <BorderTile key={i} ref={getRef(tile)} special={tile.special} />
              )
            )}
          </TileRow>
        ))}
    </Container>
  );
}

export default App;
