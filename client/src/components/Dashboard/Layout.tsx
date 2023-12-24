import { Sidebar } from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { user_atom } from "@/lib/atoms";
import { useAtom } from "jotai";

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [_, setUser] = useAtom(user_atom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="w-full h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
