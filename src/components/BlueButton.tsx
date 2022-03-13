import styled from "styled-components";

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

export default BlueButton;
