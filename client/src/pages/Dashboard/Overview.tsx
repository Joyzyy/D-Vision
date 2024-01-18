import DashboardLayout from "@/components/Dashboard/Layout";
import DashboardOverviewComponent from "@/components/Dashboard/Overview";

const DashboardHome: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <DashboardOverviewComponent />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
