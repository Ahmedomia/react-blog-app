import { useState, useEffect } from "react";
import api from "../api";

export function useUsers() {
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const users = Array.isArray(res.data) ? res.data : res.data.users;

        if (!Array.isArray(users)) {
          console.error("Users response is not an array:", users);
          return;
        }

        const newUserMap = {};
        users.forEach((user) => {
          newUserMap[user.id] = {
            name: user.name,
            profilepic: user.profilepic,
          };
        });

        setUserMap(newUserMap);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return { userMap };
}
