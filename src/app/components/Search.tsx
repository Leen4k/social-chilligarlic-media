"use client";
import React, { useCallback, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import Card from "./Card";
import Button from "./Button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push("/" + "?" + createQueryString("searchQuery", searchTerm));
    queryClient.invalidateQueries(["posts"]);
  };

  return (
    <div className="col-span-3 hidden lg:flex lg:flex-col gap-4 px-2 py-1">
      <form
        onSubmit={handleSubmit}
        action=""
        className="bg-secondary p-2 rounded-full px-4 flex gap-2 items-center"
      >
        <BiSearchAlt />
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          type="text"
          placeholder="Search"
          className="bg-secondary focus:outline-none py-2"
        />
        {/* <Button type="submit" text="Search" /> */}
      </form>
      <Card />
    </div>
  );
};

export default Search;
