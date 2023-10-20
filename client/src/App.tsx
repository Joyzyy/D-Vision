import RootLayout from "@/layout/Root";
import AppRoutes from "@/routes/AppRoutes";
import { ThemeProvider } from "./components/ThemeProvider";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RootLayout>
        <AppRoutes />
      </RootLayout>
    </ThemeProvider>
  );
};

export default App;
