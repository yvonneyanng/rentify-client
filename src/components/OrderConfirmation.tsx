import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Order } from "../types";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import NavBar from "./NavBar";

const API_URL = import.meta.env.VITE_API_URL;

const OrderConfirmation: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/orders/${vin}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    if (vin) fetchOrder();
  }, [vin]);

  if (loading)
    return (
      <Text color="orange.400" textAlign="center" py={8}>
        Loading...
      </Text>
    );
  if (error)
    return (
      <Text color="red.400" textAlign="center" py={8}>
        {error}
      </Text>
    );
  if (!order) return null;

  return (
    <Box minH="100vh" bg="gray.900">
      <NavBar title="Order Confirmation" />
      <Box
        maxW="xl"
        mx="auto"
        bg="gray.900"
        rounded="2xl"
        p={8}
        mt={4}
        color="white"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          color="white"
          textAlign="center"
        >
          Your car has been reserved!
        </Text>
        <Flex direction="column" align="center" mb={4}>
          <Text fontWeight="bold" fontSize="lg" color="orange.400" mb={2}>
            {order.car.vin}
          </Text>
          <Text
            fontSize="sm"
            color="gray.300"
            mb={1}
            textTransform="uppercase"
            letterSpacing="wider"
            textAlign="center"
          >
            Status:{" "}
            <Text as="span" fontWeight="bold" color="green.400">
              {order.status}
            </Text>
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Name: {order.customer.name}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Email: {order.customer.email}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Phone: {order.customer.phoneNumber}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Driver's License: {order.customer.driversLicenseNumber}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Start Date: {order.rental.startDate}
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Rental Period: {order.rental.rentalPeriod} day(s)
          </Text>
          <Text fontSize="xs" color="gray.400" mb={1} textAlign="center">
            Total Price: ${order.rental.totalPrice}
          </Text>
        </Flex>
        <Flex justify="center" mt={6}>
          <Button
            onClick={() => navigate("/")}
            colorScheme="orange"
            fontWeight="bold"
            px={6}
            py={2}
            rounded="md"
            bg="orange.400"
            color="black"
            _hover={{ bg: "orange.500" }}
          >
            Back to Home
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default OrderConfirmation;
