import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const toast = useToast();

  const submitHandler = async () => {
    setLoading(true);

    if (!credentials.email || !credentials.password) {
        toast({
            title: "Please fill out all the required fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
    }

    try {
        const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
    
          const { data } = await axios.post(
            `/api/user/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            config
          );

          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          navigate('/');
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="Login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={onChange}
          name="email"
          value={credentials.email}
        />
      </FormControl>
      <FormControl id="Login-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter a Password"
            onChange={onChange}
            name="password"
            value={credentials.password}
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" variant="ghost" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blackAlpha"
        w="100%"
        marginTop={15}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme="gray"
        w="100%"
        marginTop={15}
        onClick={() => {
          setCredentials({
            email: "guest@example.com",
            password: "123456",
          });
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
