import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCars, placeOrder, confirmOrder } from "../api";
import type { Car, Order } from "../types";
import { Box, Flex, Stack, Input, Button, Text, Image } from "@chakra-ui/react";
import placeholder from "/placeholder.png";
import NavBar from "@/components/NavBar";

const ReservationForm: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    driversLicenseNumber: "",
    startDate: "",
    rentalPeriod: 1,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCars().then((cars) => {
      const found = cars.find((c) => c.vin === vin);
      setCar(found || null);
      setLoading(false);
    });
  }, [vin]);

  useEffect(() => {
    if (vin) localStorage.setItem(`reservation_${vin}`, JSON.stringify(form));
    if (car) setTotalPrice(car.pricePerDay * Number(form.rentalPeriod));
  }, [form, vin, car]);

  if (loading)
    return (
      <Text color="orange.400" textAlign="center" py={8}>
        Loading...
      </Text>
    );
  if (!car)
    return (
      <Text color="red.500" textAlign="center" py={8}>
        Car not found.
      </Text>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "rentalPeriod" ? Number(value) : value,
    }));
  };

  const handleCancel = () => {
    if (vin) localStorage.removeItem(`reservation_${vin}`);
    setForm({
      name: "",
      phoneNumber: "",
      email: "",
      driversLicenseNumber: "",
      startDate: "",
      rentalPeriod: 1,
    });
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    setError(null);
    setSuccess(null);
    try {
      const order: Order = {
        customer: {
          name: form.name,
          phoneNumber: form.phoneNumber,
          email: form.email,
          driversLicenseNumber: form.driversLicenseNumber,
        },
        car: { vin: car.vin },
        rental: {
          startDate: form.startDate,
          rentalPeriod: Number(form.rentalPeriod),
          totalPrice,
          orderDate: new Date().toISOString().slice(0, 10),
        },
      };
      await placeOrder(order);
      setSuccess("Reservation successful!");
      if (vin) localStorage.removeItem(`reservation_${vin}`);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response
          ?.data?.error === "string"
      ) {
        setError(
          (err as { response: { data: { error: string } } }).response.data.error
        );
      } else {
        setError("Failed to place order");
      }
    }
  };

  const handleConfirm = async () => {
    if (!car) return;
    setError(null);
    try {
      await confirmOrder(car.vin);
      setConfirmed(true);
      navigate(`/confirmation/${car.vin}`);
    } catch {
      setError("Failed to confirm order");
    }
  };

  return (
    <Box minH="100vh" bg="gray.900">
      <NavBar title="Reserve Your Car" />
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="4xl"
        mx="auto"
        bg="transparent"
        p={{ base: 4, md: 8 }}
        mt={8}
        gap={8}
        align="stretch"
      >
        <Box
          flex={1}
          mb={{ base: 8, md: 0 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="start"
        >
          <Image
            src={car.image || placeholder}
            alt="Car"
            w="300px"
            h="200px"
            objectFit="contain"
            rounded="md"
            mb={2}
            bg="#222"
          />
          <Text fontWeight="bold" fontSize="lg" color="orange.400">
            {car.brand} {car.carModel}
          </Text>
          <Text
            fontSize="sm"
            color="gray.300"
            mb={1}
            textTransform="uppercase"
            letterSpacing="wider"
            textAlign="center"
          >
            {car.carType} • {car.yearOfManufacture}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Mileage: {car.mileage}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Fuel: {car.fuelType}
          </Text>
          <Text
            mb={2}
            color="white"
            fontSize="lg"
            fontWeight="semibold"
            textAlign="center"
          >
            ${car.pricePerDay}{" "}
            <Text as="span" color="gray.400" fontSize="xs" fontWeight="normal">
              /day
            </Text>
          </Text>
          <Box mb={2} textAlign="center">
            {car.available ? (
              <Text color="green.400" fontWeight="semibold">
                Available
              </Text>
            ) : (
              <Text color="red.400" fontWeight="semibold">
                Unavailable
              </Text>
            )}
          </Box>
          {car.description && (
            <Text fontSize="xs" color="gray.500" mb={3} textAlign="center">
              {car.description}
            </Text>
          )}
        </Box>
        <Box flex={2}>
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="gray.900"
            p={6}
            rounded="2xl"
            boxShadow="md"
          >
            <Stack gap={4}>
              <Box>
                <Text mb={1} fontWeight="semibold" color="orange.400">
                  Name
                </Text>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  size="lg"
                  bg="gray.800"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="semibold" color="orange.400">
                  Phone Number
                </Text>
                <Input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  size="lg"
                  bg="gray.800"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="semibold" color="orange.400">
                  Email
                </Text>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  type="email"
                  size="lg"
                  bg="gray.800"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Box>
              <Box>
                <Text mb={1} fontWeight="semibold" color="orange.400">
                  Driver's License Number
                </Text>
                <Input
                  name="driversLicenseNumber"
                  value={form.driversLicenseNumber}
                  onChange={handleChange}
                  required
                  placeholder="Driver's License Number"
                  size="lg"
                  bg="gray.800"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Box>
              <Flex gap={2}>
                <Box flex={1}>
                  <Text mb={1} fontWeight="semibold" color="orange.400">
                    Start Date
                  </Text>
                  <Input
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    type="date"
                    size="lg"
                    bg="gray.800"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box flex={1}>
                  <Text mb={1} fontWeight="semibold" color="orange.400">
                    Rental Period (days)
                  </Text>
                  <Input
                    name="rentalPeriod"
                    value={form.rentalPeriod}
                    onChange={handleChange}
                    required
                    type="number"
                    min={1}
                    size="lg"
                    bg="gray.800"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    placeholder="Days"
                  />
                </Box>
              </Flex>
              <Text textAlign="right" fontWeight="bold" color="orange.400">
                Total: ${totalPrice}
              </Text>
              {error && (
                <Text color="red.400" textAlign="center">
                  {error}
                </Text>
              )}
              {success && !confirmed && (
                <Text color="green.400" textAlign="center">
                  {success}
                </Text>
              )}
              {confirmed && (
                <Text
                  mt={6}
                  color="green.400"
                  textAlign="center"
                  fontWeight="bold"
                >
                  Order confirmed! Thank you for your reservation.
                </Text>
              )}
              <Flex gap={4} justify="flex-end" mt={4}>
                <Button
                  type="button"
                  onClick={handleCancel}
                  colorScheme="gray"
                  variant="outline"
                  fontWeight="bold"
                  bg="gray.800"
                  color="white"
                >
                  Cancel
                </Button>
                {!success && (
                  <Button
                    type="submit"
                    colorScheme="orange"
                    fontWeight="bold"
                    disabled={!car.available}
                    color="black"
                    bg="orange.400"
                  >
                    Submit
                  </Button>
                )}
                {car.available && success && !confirmed && (
                  <Button
                    onClick={handleConfirm}
                    colorScheme="orange"
                    fontWeight="bold"
                    color="black"
                    bg="orange.400"
                  >
                    Confirm Your Order
                  </Button>
                )}
              </Flex>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ReservationForm;
