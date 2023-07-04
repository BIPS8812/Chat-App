import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) 
            navigate('/auth');
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications }}>
          {children}
        </ChatContext.Provider>
      );
};

export const ChatState = () => {
    return useContext(ChatContext);
  };

export default ChatProvider;

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
}