import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NAVBAR_LINKS } from "@/constants";
import { Show } from "../Show";

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

const NavbarLinks: React.FC<{
  navigate: ReturnType<typeof useNavigate>;
}> = ({ navigate }) => {
  return (
    <>
      {NAVBAR_LINKS.map((page) => (
        <Button
          key={page.title}
          variant={
            page.href === window.location.pathname ? "default" : "outline"
          }
          onClick={() => navigate(page.href)}
        >
          {page.title}
        </Button>
      ))}
    </>
  );
};

const MobileNavigation: React.FC<{
  navigate: ReturnType<typeof useNavigate>;
}> = ({ navigate }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">Menu</Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>D/Vision</SheetTitle>
          <SheetDescription>
            <div className="flex flex-col space-y-2">
              <NavbarLinks navigate={navigate} />
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNavigation: React.FC<{
  navigate: ReturnType<typeof useNavigate>;
}> = ({ navigate }) => {
  return (
    <>
      <h1 className="text-xl font-bold">D/Vision</h1>
      <div className="flex flex-row space-x-2">
        <NavbarLinks navigate={navigate} />
      </div>
    </>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 768);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="w-full border-b flex flex-row justify-between p-4 mb-12 items-center">
        <Show
          when={isDesktop}
          fallback={<MobileNavigation navigate={navigate} />}
        >
          <DesktopNavigation navigate={navigate} />
        </Show>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </div>
      {children}
    </>
  );
};

export default DashboardLayout;
