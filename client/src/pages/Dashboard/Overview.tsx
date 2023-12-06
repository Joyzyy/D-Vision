import DashboardLayout from "@/components/Dashboard/Layout";
import { user_signal } from "@/lib/signals";

const DashboardHome: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
        <p className="text-xl">
          You are logged in as {JSON.stringify(user_signal.value)}!
        </p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
