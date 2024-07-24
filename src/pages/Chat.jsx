import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import FriendList from "../components/FriendsList";
import ChatScreen from "../components/ChatScreen";
import Welcome from "../components/Welcome";

const Container = styled.div`
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
`;

const FriendListContainer = styled.div`
  flex: 0 0 20vw;
  background-color: #1f1f1f;
  border-right: 1px solid #444;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChatScreenContainer = styled.div`
  flex: 0 0 80vw;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  padding: 10px;
  background: linear-gradient(90deg, #000000 0%, #434343 100%);
  color: #ffffff;
  text-align: center;
  font-size: 1.5rem;
  border-bottom: 1px solid #444;
`;

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [sender, setSender] = useState(null);

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <Container>
      <FriendListContainer>
        <Header>Friends</Header>
        <FriendList onSelectFriend={handleFriendSelect} setSender={setSender} />
      </FriendListContainer>
      <ChatScreenContainer>
        {selectedFriend == null ? (
          <Welcome />
        ) : (
          <ChatScreen selectedFriend={selectedFriend} sender={sender} />
        )}
      </ChatScreenContainer>
    </Container>
  );
};

export default Chat;
