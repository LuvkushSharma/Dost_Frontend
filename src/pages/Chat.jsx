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
  width: 100vw; /* Viewport width */
  height: 100vh; /* Viewport height */
`;

const FriendListContainer = styled.div`
  flex: 0 0 20vw; /* 30% width */
  background-color: #c3cfe2;
`;

const ChatScreenContainer = styled.div`
  flex: 0 0 80vw; /* 70% width */
  background-color: #1a759f;
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
