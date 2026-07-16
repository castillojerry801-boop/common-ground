export type ProjectStatus = "live" | "in-development" | "paused" | "planning";

export type CGProject = {
  id: string;
  name: string;
  client: string;
  type: string;
  url: string | null;
  github: string | null;
  status: ProjectStatus;
  notes: string | null;
};

export const cgProjects: CGProject[] = [
  {
    id: "common-ground",
    name: "Common Ground Workshop",
    client: "Common Ground (internal)",
    type: "Company site + FLO platform",
    url: "https://www.cg-workshop.com",
    github: "common-ground",
    status: "live",
    notes: "Main company site. FLO lives here. Toolbox, contact form, products page.",
  },
  {
    id: "gameflohq",
    name: "GameFloHQ",
    client: "Common Ground (internal)",
    type: "Youth sports SaaS platform",
    url: "https://app.gameflohq.com",
    github: "gameflohq",
    status: "live",
    notes: "Youth sports operating system. Scheduling, rosters, payments, communication.",
  },
  {
    id: "mltsa",
    name: "Mentoring Life Through Sports",
    client: "MLTSA",
    type: "Nonprofit",
    url: "https://www.mltsa.org",
    github: null,
    status: "live",
    notes: "Nonprofit shaping young lives through sports.",
  },
  {
    id: "burton-basketball",
    name: "Burton Basketball Academy",
    client: "Burton Basketball Academy",
    type: "Sports organization",
    url: "https://www.burtonbball.com",
    github: null,
    status: "live",
    notes: "Basketball training and development. Connects players, families, and coaches.",
  },
  {
    id: "elevated-beauty",
    name: "Elevated Beauty Studio",
    client: "Elevated Beauty Studio",
    type: "Beauty / booking business",
    url: "https://www.elevatedbeautystudio.com",
    github: null,
    status: "live",
    notes: "Beauty business operating system. Bookings, clients, business management.",
  },
  {
    id: "brilliant-beginnings",
    name: "Brilliant Beginnings Childcare",
    client: "Brilliant Beginnings",
    type: "Childcare / early learning",
    url: "https://brilliantbeginningsutah.com",
    github: null,
    status: "live",
    notes: "Childcare platform in Utah. Connects families and caregivers around early childhood care.",
  },
];
