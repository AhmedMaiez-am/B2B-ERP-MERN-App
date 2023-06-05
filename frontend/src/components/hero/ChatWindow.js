import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled, { keyframes } from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const ChatContainer = styled.div`
  width: 500px;
  height: 400px;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LeftBarContainer = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #f0f0f0;
`;

const LeftBarHeader = styled.h3`
  padding: 8px;
  margin: 0;
  text-align: center;
  color: #fff;
  text-decoration: underline;
  background-color: #654caf;
`;

const UserNameContainer = styled.div`
  padding: 8px;
  background-color: transparent;
  border-bottom: 1px solid #ccc;
`;

const UserName = styled.h3`
  margin: 0;
`;

const ChatContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Message = styled.div`
  background-color: #f0f0f0;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-in;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 0 16px;
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  border-radius: 24px;
  padding: 10px 14px;
  background-color: #f0f0f0;
  font-size: 14px;
  outline: none;
`;

const Button = styled.button`
  background-color: #4cafaf;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 16px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  outline: none;
  &:hover {
    background-color: #45a049;
  }
`;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const connectedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const socket = io(); // Connect to the same server host and port

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = io(); // Connect to the same server host and port
    socket.emit("chat message", inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    const socket = io(); // Connect to the same server host and port

    // Listen for incoming chat messages
    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChatContainer>
      <LeftBarContainer>
        <LeftBarHeader>Utilisateurs connectés</LeftBarHeader>
        <UserNameContainer>
          <UserName>{connectedUser && connectedUser.name}</UserName>
        </UserNameContainer>
      </LeftBarContainer>
      <ChatContent>
        <MessageContainer>
        <TransitionGroup component={null}>
            {messages.map((message, index) => (
              <CSSTransition key={index} timeout={300} classNames="fade">
                <Message>{message}</Message>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </MessageContainer>
        <InputContainer>
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </InputContainer>
      </ChatContent>
    </ChatContainer>
  );
};

export default ChatWindow;
