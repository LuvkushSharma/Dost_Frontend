import React from 'react';
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FriendListContainer = styled.div`
  max-width: 100%;
  background: #000;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  border: 1px solid #fff;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #1a1a1a;
  animation: ${fadeIn} 0.5s ease-in-out;
  
  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #fff;
`;

const FriendInfo = styled.div`
  color: #fff;
`;

const FriendName = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #fff;
`;

const FriendTitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #ccc;
`;

const FriendList = ({ onSelectFriend, setSender }) => {
  const [friendsList, setFriendsList] = useState([]);

  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v1/users/friendsList`, {headers: {
          'Access-Control-Allow-Origin': '*', 
          'Content-Type': 'application/json'
      }, withCredentials: true });

        const senderData = res.data.data.filter(
          (friend) =>
            friend.senderName &&
            friend.senderEmail &&
            friend.senderId &&
            friend.senderImageUrl
        );
        const filteredFriendsList = res.data.data.filter(
          (friend) =>
            !friend.senderName ||
            !friend.senderEmail ||
            !friend.senderId ||
            !friend.senderImageUrl
        );

        // Set sender data
        if (senderData.length > 0) {
          const sender = senderData[0];
          setSender({
            senderName: sender.senderName,
            senderEmail: sender.senderEmail,
            senderId: sender.senderId,
            senderImageUrl: sender.senderImageUrl,
          });
        }

        // Set friendsList
        setFriendsList(filteredFriendsList);
      } catch (error) {
        console.error("Error fetching friend requests:", error.message);
      }
    };

    fetchFriendRequests();
  }, []);

  return (
    <FriendListContainer>
      {friendsList.map((friend, index) => (
        <FriendItem
          key={friend._id || index}
          onClick={() => onSelectFriend(friend)}
        >
          <Avatar src={friend.cloudinaryImageUrl} alt={friend.name} />
          <FriendInfo>
            <FriendName>{friend.name}</FriendName>
            <FriendTitle>Title: {friend.title}</FriendTitle>
          </FriendInfo>
        </FriendItem>
      ))}
    </FriendListContainer>
  );
};

export default FriendList;
