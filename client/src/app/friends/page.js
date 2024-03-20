"use client";
import { WithAuth } from "@/components/Auth/WithAuth";
import { useEffect, useState } from "react";
import api from "../../utils/api"

const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    api.get("friendship/friends/all").then((response) => {
      setFriends(response.data);
      console.log(response.data);
    });
  }, []);


  return (
    <>
      <h1>Friends</h1>
    </>
  );
}

export default WithAuth(Friends);