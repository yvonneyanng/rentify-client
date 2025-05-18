import React, { useEffect, useState } from "react";
import type { Car } from "../types";
import { fetchCars } from "../api";
import { useNavigate } from "react-router-dom";
import { SimpleGrid, Box, Text, Button, Image, Flex } from "@chakra-ui/react";

interface CarGridProps {
  search?: string;
  type?: string;
  brand?: string;
}

const CarGrid: React.FC<CarGridProps> = ({
  search = "",
  type = "",
  brand = "",
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchCars({ search, type, brand })
      .then(setCars)
      .catch(() => setError("Failed to load cars"))
      .finally(() => setLoading(false));
  }, [search, type, brand]);

  if (loading)
    return (
      <Text
        color="orange.400"
        textAlign="center"
        fontSize="lg"
        fontWeight="semibold"
        py={8}
      >
        Loading cars...
      </Text>
    );
  if (error)
    return (
      <Text
        color="red.500"
        textAlign="center"
        fontSize="lg"
        fontWeight="semibold"
        py={8}
      >
        {error}
      </Text>
    );
  if (cars.length === 0)
    return (
      <Text
        color="gray.400"
        textAlign="center"
        fontSize="lg"
        fontWeight="semibold"
        py={8}
      >
        No cars found.
      </Text>
    );

  return (
    <Box w="full" maxW="7xl" mx="auto" px={4}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        gap={4}
        justifyItems="center"
        my={10}
      >
        {cars.map((car) => (
          <Box
            key={car.vin}
            bg="white"
            borderRadius="2xl"
            boxShadow="md"
            border="1px solid #eee"
            bgColor="white"
            p={5}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            minH="370px"
            maxW="300px"
            w="full"
            transition="box-shadow 0.2s, border 0.2s"
            _hover={{ boxShadow: "xl" }}
          >
            <Image
              src="/placeholder.png"
              alt="Car"
              w="100%"
              h="150px"
              objectFit="cover"
              mb={4}
              borderRadius="md"
              bg="#f5f5f5"
            />
            <Box
              mb={2}
              alignSelf="flex-start"
              px={3}
              py={1}
              bg="orange.100"
              color="orange.700"
              borderRadius="md"
              fontWeight="bold"
              fontSize="md"
            >
              {car.carType}
            </Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={1}
              color="gray.800"
              textAlign="left"
            >
              {car.brand} {car.carModel}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={1} textAlign="left">
              Year: {car.yearOfManufacture}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={1} textAlign="left">
              Mileage: {car.mileage}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={1} textAlign="left">
              Fuel: {car.fuelType}
            </Text>
            <Text
              fontSize="sm"
              color={car.available ? "green.500" : "red.500"}
              mb={1}
              textAlign="left"
              fontWeight="semibold"
            >
              {car.available ? "Available" : "Unavailable"}
            </Text>
            {car.description && (
              <Text fontSize="xs" color="gray.500" mb={2} textAlign="left">
                {car.description}
              </Text>
            )}
            <Flex gap={4} justify="space-between" align="center" mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="black" mb={0}>
                ${car.pricePerDay}/day
              </Text>
              <Button
                type="button"
                onClick={() => car.available && navigate(`/reserve/${car.vin}`)}
                borderRadius="full"
                px={6}
                fontWeight="bold"
                disabled={!car.available}
                opacity={car.available ? 1 : 0.5}
                cursor={car.available ? "pointer" : "not-allowed"}
                color="white"
                bg="black"
              >
                {car.available ? "Rent" : "Unavailable"}
              </Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CarGrid;
