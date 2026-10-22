// Field definitions that drive the generic admin list + form screens.

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "tags"
  | "select"
  | "image"
  | "file"
  | "url"
  | "email";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  /** Span both columns of the form grid. */
  wide?: boolean;
  /** Suggestions shown in a datalist (text fields). */
  suggestions?: string[];
};

export type Resource = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  fields: Field[];
  /** Columns shown in the admin table. */
  columns: { name: string; label: string; type?: "boolean" | "tags" | "badge" | "number" }[];
  order: [string, boolean][];
  hasSlug?: boolean;
};

const sortOrder: Field = {
  name: "sort_order",
  label: "Sort order",
  type: "number",
  help: "Lower numbers appear first.",
};

export const resources: Record<string, Resource> = {
  projects: {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "Project",
    description: "Case studies and data projects shown in the Projects section.",
    hasSlug: true,
    order: [["sort_order", true], ["created_at", false]],
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category", type: "badge" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", help: "URL part. Leave empty to generate it from the title." },
      {
        name: "category",
        label: "Category",
        type: "text",
        suggestions: ["Machine Learning", "Machine Learning · NLP", "Data Analysis", "Web Development"],
      },
      { name: "tech", label: "Tech stack", type: "tags", placeholder: "Python, Pandas, Power BI" },
      { name: "summary", label: "Short summary", type: "textarea", wide: true, help: "1–2 sentences for the project card." },
      { name: "content", label: "Case study (Markdown)", type: "markdown", wide: true },
      { name: "image_url", label: "Cover image", type: "image", wide: true },
      { name: "github_url", label: "GitHub / notebook URL", type: "url" },
      { name: "live_url", label: "Live demo / dashboard URL", type: "url" },
      { name: "report_url", label: "Report / paper URL", type: "url" },
      { name: "featured", label: "Featured project", type: "boolean" },
      sortOrder,
    ],
  },
  skills: {
    key: "skills",
    table: "skills",
    label: "Skills",
    singular: "Skill",
    description: "Skills grouped by category, each with a proficiency level.",
    order: [["sort_order", true], ["created_at", true]],
    columns: [
      { name: "name", label: "Skill" },
      { name: "category", label: "Category", type: "badge" },
      { name: "level", label: "Level", type: "number" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "name", label: "Skill name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
        suggestions: ["Programming", "Data Science & ML", "Databases", "Web Technologies", "Tools"],
      },
      { name: "level", label: "Proficiency (0–100)", type: "number" },
      sortOrder,
    ],
  },
  experience: {
    key: "experience",
    table: "experiences",
    label: "Experience & Education",
    singular: "Entry",
    description: "Jobs, education and volunteering shown on the timeline.",
    order: [["sort_order", true], ["created_at", false]],
    columns: [
      { name: "title", label: "Title" },
      { name: "organization", label: "Organization" },
      { name: "kind", label: "Type", type: "badge" },
      { name: "sort_order", label: "Order", type: "number" },
    ],
    fields: [
      {
        name: "kind",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { value: "work", label: "Work / Internship" },
          { value: "education", label: "Education" },
          { value: "volunteer", label: "Volunteering / Leadership" },
        ],
      },
      { name: "title", label: "Role / Degree", type: "text", required: true },
      { name: "organization", label: "Company / Institution", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start", type: "text", placeholder: "Jan 2025" },
      { name: "end_date", label: "End", type: "text", placeholder: "Leave empty for “Present”" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      sortOrder,
    ],
  },
  certifications: {
    key: "certifications",
    table: "certifications",
    label: "Certifications & Achievements",
    singular: "Item",
    description: "Certificates, awards, competitions and other achievements.",
    order: [["sort_order", true], ["created_at", false]],
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category", type: "badge" },
      { name: "kind", label: "Type", type: "badge" },
      { name: "date", label: "Date" },
    ],
    fields: [
      {
        name: "kind",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { value: "certification", label: "Certification" },
          { value: "achievement", label: "Achievement" },
        ],
      },
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "text",
        help: "Used for the filter buttons on the site, e.g. Data Science.",
        suggestions: ["Data Science", "Machine Learning & AI", "Programming", "Databases", "Professional Development"],
      },
      { name: "issuer", label: "Issuer / Organizer", type: "text" },
      { name: "date", label: "Date", type: "text", placeholder: "2025" },
      { name: "credential_url", label: "Credential URL", type: "url" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "image_url", label: "Certificate image", type: "image", wide: true },
      sortOrder,
    ],
  },
  posts: {
    key: "posts",
    table: "posts",
    label: "Blog",
    singular: "Post",
    description: "Articles, tutorials and analysis write-ups.",
    hasSlug: true,
    order: [["created_at", false]],
    columns: [
      { name: "title", label: "Title" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "slug", label: "Slug", type: "text", help: "Leave empty to generate it from the title." },
      { name: "tags", label: "Tags", type: "tags", placeholder: "EDA, Python" },
      { name: "excerpt", label: "Excerpt", type: "textarea", wide: true },
      { name: "content", label: "Content (Markdown)", type: "markdown", wide: true },
      { name: "cover_url", label: "Cover image", type: "image", wide: true },
      { name: "published", label: "Published", type: "boolean", help: "Unpublished posts are only visible here." },
    ],
  },
};

export const profileFields: Field[] = [
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "roles", label: "Roles (typing animation)", type: "tags", placeholder: "Data Analyst, Data Scientist" },
  { name: "headline", label: "Headline", type: "textarea", wide: true, help: "One sentence under your name in the hero." },
  { name: "bio", label: "About me (Markdown)", type: "markdown", wide: true },
  { name: "focus", label: "Focus areas", type: "text", placeholder: "Analytics · Machine Learning · BI" },
  { name: "years_experience", label: "Years of experience", type: "text", placeholder: "1+", help: "Leave empty to hide this stat." },
  { name: "location", label: "Location", type: "text" },
  { name: "email", label: "Public email", type: "email" },
  { name: "phone", label: "Phone (optional)", type: "text" },
  { name: "available", label: "Open to work", type: "boolean" },
  { name: "avatar_url", label: "Profile photo", type: "image", wide: true },
  { name: "resume_url", label: "CV / Resume (PDF)", type: "file", wide: true },
  { name: "github", label: "GitHub URL", type: "url" },
  { name: "linkedin", label: "LinkedIn URL", type: "url" },
  { name: "kaggle", label: "Kaggle URL", type: "url" },
  { name: "twitter", label: "X / Twitter URL", type: "url" },
  { name: "facebook", label: "Facebook URL", type: "url" },
];
