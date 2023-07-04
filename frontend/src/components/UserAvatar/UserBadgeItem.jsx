import { Badge } from "@chakra-ui/react";
import { PropTypes } from "prop-types";
import { Icon } from "@iconify/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="blackAlpha"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin._id === user._id && <span> ~Admin</span>}
      <Icon
        icon="basil:cross-solid"
        color="white"
        width="26"
        height="26"
        pl={1}
      />
    </Badge>
  );
};

export default UserBadgeItem;

UserBadgeItem.propTypes = {
  user: PropTypes.object,
  handleFunction: PropTypes.func,
  admin: PropTypes.object
};
