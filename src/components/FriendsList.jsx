import React from 'react';
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import styled from "styled-components";

const FriendListContainer = styled.div`
  max-width: 100%;
  background-color: #6c757d;
  overflow-y: auto;
`;

const FriendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #495057;

  &:hover {
    background-color: #adb5bd;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const FriendInfo = styled.div``;

const FriendName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const FriendTitle = styled.p`
  margin: 0;
  font-size: 14px;
`;

const FriendList = ({ onSelectFriend, setSender }) => {
  const [friendsList, setFriendsList] = useState([]);

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/v1/users/friendsList`, { withCredentials: true });

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
