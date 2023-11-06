import { useState, useEffect } from "react";
import { user } from "@/models/user";
import { SERVER_URL } from "@/constants";
import DashboardLayout from "@/components/Dashboard/Layout";

const DashboardHome: React.FC = () => {
  const [userData, setUserData] = useState<user>();
  useEffect(() => {
    fetch(`${SERVER_URL}/users/current`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data: { user: user; error: string }) => {
        if (!data || data.error) {
          return;
        }
        setUserData(data.user);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
        <p className="text-xl">You are logged in as {userData?.name}!</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
