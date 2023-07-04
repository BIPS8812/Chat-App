import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import skull from "../../assets/skull-icon.svg";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../context/chatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";
import ProfileModal from "./ProfileModal";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SlideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/auth");
  };

  const { onOpen, isOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to search user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="5px 10px 5px 10px"
      w="100%"
      borderWidth="3px"
      bg="white"
    >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen} borderWidth="0.5px">
          <Icon
            icon="material-symbols:search"
            color="black"
            width="26"
            height="26"
          />
          <Text display={{ base: "none", md: "flex" }} p={4}>
            Search Users
          </Text>
        </Button>
      </Tooltip>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="50%"
        borderRadius="1g"
      >
        <Text
          display={{ base: "none", md: "flex" }}
          fontSize="2xl"
          fontFamily="Orbit"
          textAlign="center"
        >
          Darkside
        </Text>
        <Image src={skull} w="2rem" />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Menu>
          <MenuButton p={2}>
            <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
            />
            <Icon icon="mdi:bell" color="black" width="26" height="26" />
          </MenuButton>
          <MenuList pl={2}>
            {!notifications.length && "No New Messages"}
            {notifications.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotifications(notifications.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={
              <Icon
                icon="tabler:chevron-down"
                color="black"
                width="26"
                height="26"
              />
            }
          >
            <Avatar size="sm" name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={onChange}
              />
              <Button onClick={handleSearch}>
                <Icon
                  icon="material-symbols:search"
                  color="black"
                  width="26"
                  height="26"
                />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SlideDrawer;
