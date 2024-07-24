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
import Markdown from "react-markdown";
import TextField from "@mui/material/TextField";

// Socket initialization outside the component
const socket = io("http://localhost:3000");

const ChatContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
`;

const Header = styled.div`
  background: linear-gradient(90deg, #000000 0%, #434343 100%);
  color: #ffffff;
  padding: 10px;
  text-align: center;
`;

const VideoCallButton = styled.button`
  background-color: #333333;
  border: none;
  color: #ffffff;
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
    background-color: #444444;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  background-color: #333333;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.isSender ? "#444444" : "#555555")};
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #cccccc;
  margin-left: 5px;
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
  color: #ffffff;
`;

const SpeechRecognitionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
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

  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    // Fetch previous chats when the selected friend changes
    if (selectedFriend) {
      const fetchChats = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/api/v1/users/chats/${selectedFriend.id}`,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
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
        const res = await axios.put(
          `${baseUrl}/api/v1/users/chats/edit`,
          {
            senderId,
            receiverId,
            oldMessage: msg,
            newMessage: editedMessage,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

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
        .post(
          `${baseUrl}/api/v1/users/pay`,
          {
            token: token.id,
            amount: totalAmount,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
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
              <h1>Chat with {selectedFriend?.name}</h1>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                      <Markdown style={{ marginRight: "4px" }}>
                        {msg.message}
                      </Markdown>
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
          <TextField
            value={message}
            multiline
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "5px",
              outline: "none",
              border: "none",
            }}
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
