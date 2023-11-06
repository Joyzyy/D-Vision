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

const SIDEBAR_LINKS: {
  title: string;
  href: string;
  icon?: any;
}[] = [
  {
    title: "Overview",
    href: pages.dashboard.index,
  },
  {
    title: "Events",
    href: pages.dashboard.events,
  },
  {
    title: "Settings",
    href: pages.dashboard.me,
  },
];

export { pages, SERVER_URL, SIDEBAR_LINKS };
