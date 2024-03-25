import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "/images/robot.gif";
export default function Welcome() {
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
`;
