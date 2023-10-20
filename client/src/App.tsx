import RootLayout from "@/layout/Root";
import AppRoutes from "@/routes/AppRoutes";

const App: React.FC = () => {
  return (
    <RootLayout>
      <AppRoutes />
    </RootLayout>
  );
};

export default App;
