import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ParticipantComponent } from "@/components/Home/Participant";
import { EventOrganizerComponent } from "@/components/Home/EventOrganizer";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-12">
      <div>D/Vision Logo</div>
      <Tabs defaultValue="participant" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participant">Participant</TabsTrigger>
          <TabsTrigger value="event_organizer">Event Organizer</TabsTrigger>
        </TabsList>
        <TabsContent value="participant">
          <ParticipantComponent />
        </TabsContent>
        <TabsContent value="event_organizer">
          <EventOrganizerComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
