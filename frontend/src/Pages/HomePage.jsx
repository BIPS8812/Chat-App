import { Container, Box, Text, Image, Tab, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { Login, SignUp } from '../components'
import skull from '../assets/skull-icon.svg'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Container maxW="x1" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="50%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text w='30%' fontSize="4xl" fontFamily="Orbit" textAlign='center'>
          Darkside
        </Text>
        <Image src={skull} w='3rem' />
      </Box>
      <Box bg="white" w="50%" p={4} borderRadius="1g" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="blackAlpha">
          <TabList d="flex" justifyContent="center" alignItems="center" >
            <Tab w="40%">Login</Tab>
            <Tab w="40%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
