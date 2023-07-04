import { Icon } from "@iconify/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import profileBG from "../../assets/profileBG.jpeg";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Icon icon="zondicons:dots-horizontal-triple" color="black" width="26" height="26" onClick={onOpen}/>
      )}

      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p="3rem"
          bgImage={profileBG}
          bgPosition="center"
          bgRepeat="no-repeat"
        >
          <ModalHeader
            fontFamily="Orbit"
            fontSize="2rem"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "1rem", md: "1.2rem" }}
              fontFamily="Orbit"
              marginTop="1rem"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

ProfileModal.propTypes = {
  children: PropTypes.node.isRequired,

  user: PropTypes.object,
};
