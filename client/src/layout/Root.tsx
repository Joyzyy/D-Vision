import { Toaster } from "@/components/ui/toaster";

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main>{children}</main>
      <Toaster />
    </>
  );
};

export default RootLayout;
