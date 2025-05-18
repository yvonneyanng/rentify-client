import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

interface NavBarProps {
  title: string;
}

const NavBar: React.FC<NavBarProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={30}
      w="100%"
      bgGradient="linear(to-b, black, gray.900)"
      boxShadow="sm"
      backdropFilter="blur(8px)"
      py={4}
      px={{ base: 2, md: 6 }}
      minW={0}
      mb={8}
    >
      <Flex
        w="100%"
        maxW="1440px"
        mx="auto"
        align="center"
        gap={4}
        position="relative"
      >
        <Image
          src="/logo.png"
          alt="Rentify logo"
          h={12}
          w="auto"
          maxW="xs"
          onClick={() => navigate("/")}
          cursor="pointer"
        />
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          position="absolute"
          left={0}
          right={0}
          pointerEvents="none"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="orange.400"
            textAlign="center"
          >
            {title}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
