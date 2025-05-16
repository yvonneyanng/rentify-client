import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image } from "@chakra-ui/react";
import SearchBar from "./SearchBar";

interface NavBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filter: string;
  onFilterChange: (val: string) => void;
  filterOptions: string[];
}

const NavBar: React.FC<NavBarProps> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={30}
      w="100%"
      bgGradient="linear(to-b, whiteAlpha.200, whiteAlpha.300)"
      boxShadow="sm"
      backdropFilter="blur(8px)"
      py={4}
      px={{ base: 2, md: 9 }}
      minW={0}
    >
      <Flex
        w="100%"
        maxW="100%"
        mx="auto"
        align="center"
        gap={{ base: 2, sm: 4, md: 8 }}
        px={0}
      >
        <Image
          src="/logo.png"
          alt="Rentify logo"
          h={12}
          w="auto"
          maxW="sm"
          onClick={() => navigate("/")}
          cursor="pointer"
        />
        <Box flex={1} minW={0}>
          <SearchBar value={search} onChange={onSearchChange} />
        </Box>
        <Box p={1}>
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{
              width: "160px",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              padding: "0.5rem",
              border: "1px solid",
              borderColor: "#2b2b2b",
            }}
          >
            <option value="">All Types</option>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
