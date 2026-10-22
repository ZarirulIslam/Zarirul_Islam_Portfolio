export type Profile = {
  id: number;
  name: string;
  roles: string[];
  headline: string | null;
  bio: string | null;
  focus: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  available: boolean;
  years_experience: string | null;
  github: string | null;
  linkedin: string | null;
  kaggle: string | null;
  twitter: string | null;
  facebook: string | null;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  category: string | null;
  tech: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  report_url: string | null;
  featured: boolean;
  sort_order: number;
};

export type Experience = {
  id: string;
  kind: "work" | "education" | "volunteer";
  title: string;
  organization: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

export type Certification = {
  id: string;
  kind: "certification" | "achievement";
  title: string;
  category: string | null;
  issuer: string | null;
  date: string | null;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  sort_order: number;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};
