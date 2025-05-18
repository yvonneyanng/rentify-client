import React, { useState, useEffect } from "react";
import HomeNavBar from "./HomeNavBar";
import CarGrid from "./CarGrid";
import { fetchCars } from "../api";
import { useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchCars().then((cars) => {
      setFilterOptions(Array.from(new Set(cars.map((c) => c.carType))).sort());
    });
  }, []);

  return (
    <>
      <HomeNavBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
        onLogoClick={() => setSearch("")}
      />
      <CarGrid key={location.key} search={search} type={filter} />
    </>
  );
};

export default Home;
