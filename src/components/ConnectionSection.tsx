import styled from "styled-components";
import ConnectionBtn from "./ConnectionBtn";
import React from "react";

const ConnectionBtnContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 240px;
  height: 280px;
  z-index: 200;
`;


export default function ConnectionSection() {
  return (
    <ConnectionBtnContainer>
      <ConnectionBtn />
    </ConnectionBtnContainer>
  );
}
