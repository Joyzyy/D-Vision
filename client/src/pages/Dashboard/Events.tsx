import DashboardLayout from "@/components/Dashboard/Layout";
import DashboardEventsComponent from "@/components/Dashboard/Events";

const DashboardEvents: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <DashboardEventsComponent />
      </div>
    </DashboardLayout>
  );
};

export default DashboardEvents;
