import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { PropTypes } from "prop-types";
import { ChatState } from "../context/chatProvider";
import { Icon } from "@iconify/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscallaneous/ProfileModal";
import UpdateGroupModal from "./miscallaneous/UpdateGroupModal";
import { useEffect, useState } from "react";
import ChatBG from "../assets/chatbgggg.jpeg";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import "./Styles.css";
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/Typing.json"

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, [user]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications]);
          setFetchAgain(!fetchAgain); // Rendering the my chats again
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const fetchChats = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if ((e.type === "click" || e.key === "Enter") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `/api/messages`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    fetchChats();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Orbit"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              variant="ghost"
              colorScheme="blackAlpha"
              onClick={() => setSelectedChat("")}
            >
              <Icon
                icon="ic:baseline-arrow-back"
                color="black"
                width="26"
                height="26"
                display={{ base: "flex", md: "none" }}
                onClick={() => setSelectedChat("")}
              />
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {" "}
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <Avatar
                    name={getSenderFull(user, selectedChat.users).name}
                    src={getSenderFull(user, selectedChat.users).pic}
                  />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchChats={fetchChats}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            borderWidth={1}
            bgImage={ChatBG}
            bgPosition="center"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <span>
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              </span>
            ) : (
              <></>
            )}
            <FormControl
              onKeyDown={sendMessage}
              bg="#E0E0E0"
              id="first-name"
              isRequired
              mt={3}
              borderRadius="6px"
            >
              <InputGroup>
                <Input
                  variant="filled"
                  bg="transparent"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement>
                  <Icon
                    icon="akar-icons:send"
                    width="26"
                    height="26"
                    color="gray"
                    onClick={sendMessage}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

SingleChat.propTypes = {
  fetchAgain: PropTypes.bool,
  setFetchAgain: PropTypes.func,
};
