const pages = {
  home: "/",
  dashboard: {
    index: "/dashboard",
    events: "/dashboard/events",
    me: "/dashboard/me",
  },
};

// const SERVER_URL = "http://206.189.53.60";
const SERVER_URL = "http://localhost:3000";

const NAVBAR_LINKS: {
  title: string;
  href: string;
  icon?: any;
}[] = [
  {
    title: "Overview",
    href: pages.dashboard.index,
  },
  {
    title: "Event groups",
    href: pages.dashboard.events,
  },
];

export { pages, SERVER_URL, NAVBAR_LINKS };
