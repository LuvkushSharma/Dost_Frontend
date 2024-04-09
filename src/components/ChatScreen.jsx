import React, { useState, useEffect } from "react";
import styled, { StyleSheetManager } from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons/faPencilAlt";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaymentIcon from "@mui/icons-material/Payment";
import Stripe from "react-stripe-checkout";
import VideocamIcon from "@mui/icons-material/Videocam";

// Socket initialization outside the component
const socket = io("https://dost-backend.onrender.com");

const ChatContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: #161a1d;
  color: #fff;
  padding: 10px;
  text-align: center;
`;

const VideoCallButton = styled.button`
  background-color: #2b2d42;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #14213d; /* Darker Green */
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  background-color: #0a0908;
`;

const InputBox = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  text-align: ${(props) => (props.isSender ? "right" : "left")};
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #14213d;
  background-color: ${(props) => (props.isSender ? "#6c757d" : "#343a40")};
  color: ${(props) => (props.isSender ? "#fff" : "#000")};
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #000000;
`;

const EmojiPickerContainer = styled.div`
  border-radius: 5px;
  position: absolute;
  bottom: calc(100% + 10px);
  right: 10px;
  z-index: 1;
`;

const EmojiPickerButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #fff;
`;

const SpeechRecognitionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #fff;
`;

const ChatScreen = ({ selectedFriend, sender }) => {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [listening, setListening] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const baseUrl = "https://dost-backend.onrender.com";

  useEffect(() => {
    // Fetch previous chats when the selected friend changes
    if (selectedFriend) {
      const fetchChats = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/api/v1/users/chats/${selectedFriend.id}`, { withCredentials: true }
          );

          const { chats } = response.data.data;
          // Separate sent and received messages
          const sent = [];
          const received = [];
          chats.forEach((chat) => {
            if (chat.sender.toString() === sender.senderId.toString()) {
              sent.push(chat);
            } else {
              received.push(chat);
            }
          });
          setSentMessages(sent);
          setReceivedMessages(received);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };
      fetchChats();
    }

    const roomId = sender.senderId + selectedFriend.id;

    // Join the selected friend's room upon selecting a friend
    if (selectedFriend) {
      socket.emit("joinRoom", roomId);
    }

    // Clean up socket connection
    return () => {
      socket.off("joinRoom");
    };
  }, [selectedFriend, sender]);

  useEffect(() => {
    // Listen for messageReceived event from the server
    socket.on("messageReceived", (data) => {
      if (!receivedMessages.find((msg) => msg._id === data._id)) {
        // Add the received message to the receivedMessages state
        setReceivedMessages((prev) => [...prev, data]);
      }
    });

    // Listen for messageSaved event (for sender's real-time update)
    socket.on("messageSaved", (newChat) => {
      if (!sentMessages.find((msg) => msg._id === newChat._id)) {
        // Add the saved message to the sentMessages state
        setSentMessages((prev) => [...prev, newChat]);
      }
    });

    // Clean up socket connection
    return () => {
      socket.off("messageReceived");
      socket.off("messageSaved");
    };
  }, [selectedFriend, sender, sentMessages, receivedMessages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    socket.emit("chatMessage", { sender, recipient: selectedFriend, message });

    setMessage(""); // Clear input box
  };

  const handleEmojiSelect = (event) => {
    setMessage(message + event.emoji);
  };

  const handleSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      recognition.stop();
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const calculateRelativeTime = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  const navigate = useNavigate();

  const handleVideoCallClick = () => {
    // Navigate to the video call screen with state
    navigate("/room", { state: { selectedFriend, sender } });
  };

  const handleMessageMenu = (index) => {
    setOpenMenuIndex(index);
    setOpen(!open);
  };

  const handleEdit = (index) => {
    setEditMode(true);
    setEditIndex(index);
  };

  const handleSaveEdit = async (msg) => {
    const senderId = sender.senderId;
    const receiverId = selectedFriend.id;

    try {
      if (editedMessage) {
        const res = await axios.put(`${baseUrl}/api/v1/users/chats/edit`, {
          senderId,
          receiverId,
          oldMessage: msg,
          newMessage: editedMessage,
        }, { withCredentials: true });

        if (res.status === 200) {
          if (senderId === sender.senderId) {
            // Update sentMessages state with the edited message
            setSentMessages((prevSentMessages) => {
              const updatedMessages = prevSentMessages.map((x) => {
                if (x.message === msg) {
                  return { ...x, message: editedMessage };
                }
                return x;
              });
              return updatedMessages;
            });
          } else {
            // Update receivedMessages state with the edited message
            setReceivedMessages((prevReceivedMessages) => {
              const updatedMessages = prevReceivedMessages.map((x) => {
                if (x.message === msg) {
                  return { ...x, message: editedMessage };
                }
                return x;
              });
              return updatedMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error editing message:", error);
      // Handle error
    }

    setEditMode(false);
  };

  const handleDeleteMessage = async (message, messageSender) => {
    try {
      let senderId = sender.senderId;
      let receiverId = selectedFriend.id;

      if (senderId !== messageSender) {
        senderId = messageSender;
        receiverId = sender.senderId;
      }

      const res = await axios.delete(`${baseUrl}/api/v1/users/chats/delete`, {
        data: { senderId, receiverId, message },
      }, , { headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
    } , withCredentials: true });

      if (res.status === 204) {
        if (senderId === sender.senderId) {
          setSentMessages((prev) =>
            prev.filter((msg) => msg.message !== message)
          );
        } else {
          setReceivedMessages((prev) =>
            prev.filter((msg) => msg.message !== message)
          );
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      // Handle error
    }
  };

  const handlePaymentClick = (totalAmount, token) => {
    // Add your logic for handling the click event here
    try {
      axios
        .post(`${baseUrl}/api/v1/users/pay`, {
          token: token.id,
          amount: totalAmount,
        }, { withCredentials: true })
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error processing payment:", error);
      // Handle error
    }
  };

  const tokenHandler = (token) => {
    handlePaymentClick(500, token);
  };

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "isSender"}>
      <ChatContainer>
        <Header>
          {selectedFriend && (
            <>
              <h2>{selectedFriend.name}</h2>
              <VideoCallButton onClick={handleVideoCallClick}>
                <VideocamIcon />
              </VideoCallButton>
            </>
          )}
        </Header>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          <MessageContainer>
            {[...sentMessages, ...receivedMessages]
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map((msg, index) => (
                <MessageItem
                  key={index}
                  isSender={msg.sender === sender.senderId}
                >
                  <div>
                    <strong style={{ marginRight: "3px" }}>
                      {msg.sender === sender.senderId
                        ? "(You)"
                        : selectedFriend.name}
                    </strong>
                    {editMode && editIndex === index ? (
                      <input
                        type="text"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                      />
                    ) : (
                      <span style={{ marginRight: "4px" }}>{msg.message}</span>
                    )}
                    <TimeStamp>
                      {calculateRelativeTime(msg.timestamp)}
                    </TimeStamp>

                    <IconButton
                      aria-label="Message options"
                      onClick={() => handleMessageMenu(index)}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>
                    {openMenuIndex === index && open && (
                      <div className="message-menu">
                        {msg.sender === sender.senderId &&
                          (editMode ? (
                            <IconButton
                              onClick={() => handleSaveEdit(msg.message)}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => handleEdit(index)}>
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </IconButton>
                          ))}
                        <IconButton
                          onClick={() =>
                            handleDeleteMessage(msg.message, msg.sender)
                          }
                          style={{ color: "white" }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </MessageItem>
              ))}
          </MessageContainer>
        </div>
        <InputContainer>
          <IconButton>
            <Stripe
              stripeKey="pk_test_51OxrLtSE58zGqWNRmKoIytwdUsKsxkq8AfTJ4Sb2Gb04ufHCOJRH93Wvw3JLjTtoJAZBs2w2v9NF9equYEaGOWRf00sjXJgD8j"
              token={tokenHandler}
              amount={500}
              name="Payment"
            >
              <PaymentIcon style={{ color: "#fff" }} />
            </Stripe>
          </IconButton>
          <InputBox
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <SpeechRecognitionButton onClick={handleSpeechRecognition}>
            🎤
          </SpeechRecognitionButton>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendClick}
            style={{ backgroundColor: "#495057", color: "#fff" }}
          >
            Send
          </Button>
          {/* <SendButton onClick={handleSendClick}>Send</SendButton> */}
          <div style={{ position: "relative" }}>
            <EmojiPickerButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😀
            </EmojiPickerButton>
            {showEmojiPicker && (
              <EmojiPickerContainer>
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </EmojiPickerContainer>
            )}
          </div>
        </InputContainer>
      </ChatContainer>
    </StyleSheetManager>
  );
};

export default ChatScreen;
