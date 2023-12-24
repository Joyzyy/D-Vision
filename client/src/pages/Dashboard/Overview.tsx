import DashboardLayout from "@/components/Dashboard/Layout";
import { user_atom } from "@/lib/atoms";
import { useAtom } from "jotai";

const DashboardHome: React.FC = () => {
  const [user] = useAtom(user_atom);
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
        <p className="text-xl">You are logged in as {JSON.stringify(user)}!</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
