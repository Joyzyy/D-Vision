import { useAtom } from "jotai";
import { user_atom } from "@/lib/atoms";

const DashboardSettingsComponent: React.FC = () => {
  const [user] = useAtom(user_atom);
  return <></>;
};

export default DashboardSettingsComponent;
