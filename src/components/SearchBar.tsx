import React, { useRef, useState } from "react";
import { fetchCars } from "../api";
import type { Car } from "../types";
import { Box, Input, Text } from "@chakra-ui/react";

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState<Car[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (val.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    timeoutRef.current = window.setTimeout(async () => {
      const cars = await fetchCars({ search: val });
      setSuggestions(cars.slice(0, 5));
      setShowDropdown(true);
    }, 200);
  };

  const handleSelect = (car: Car) => {
    onChange(car.brand + " " + car.carModel);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <Box position="relative" w="full" maxW="xl" mx="auto" mb={0}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search cars by brand, model, or type..."
        size="lg"
        borderRadius="lg"
        bg="black"
        color="white"
        _placeholder={{ color: "gray.400" }}
        fontSize="lg"
        px={6}
        py={4}
      />
      {showDropdown && suggestions.length > 0 && (
        <Box
          position="absolute"
          left={0}
          right={0}
          bg="black"
          borderWidth={1}
          borderColor="orange.400"
          borderRadius="2xl"
          mt={2}
          zIndex={20}
          boxShadow="xl"
          overflow="hidden"
        >
          {suggestions.map((car) => (
            <Box
              key={car.vin}
              px={6}
              py={3}
              cursor="pointer"
              _hover={{ bg: "gray.100", color: "black" }}
              fontSize="lg"
              borderBottomWidth={1}
              borderBottomColor="orange.100"
              onClick={() => handleSelect(car)}
              transition="background 0.2s, color 0.2s"
            >
              <Text as="span" fontWeight="bold" color="orange.400" mr={2}>
                {car.brand}
              </Text>
              {car.carModel}{" "}
              <Text as="span" fontSize="xs" color="gray.400">
                ({car.carType})
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBox;
