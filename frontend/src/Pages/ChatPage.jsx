// import axios from "axios";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { SlideDrawer, MyChat, ChatBox } from "../components"

const ChatPage = () => {
  // const host = "http://localhost:3000";
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate('/auth');
    }
  }, [navigate]);

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%"}}>
      {user && <SlideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
      
    </div>
  );
};

export default ChatPage;
