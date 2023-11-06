import { Sidebar } from "../Sidebar";

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="w-full h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
