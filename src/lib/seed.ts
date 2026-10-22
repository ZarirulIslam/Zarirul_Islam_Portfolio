// Starter content, taken from the resume. Shown when Supabase is not configured yet, and importable
// into the database from the admin dashboard ("Import starter content").
import type { Certification, Experience, Post, Profile, Project, Skill } from "./types";

export const seedProfile: Profile = {
  id: 1,
  name: "Muhammad Zarirul Islam",
  roles: ["Data Analyst", "Data Science Graduate", "Machine Learning Researcher", "Python Developer"],
  headline:
    "MSc in CSE (Data Science) turning data into insight with Python, SQL and machine learning.",
  bio: `I'm a Computer Science graduate with an **MSc (Major in Data Science)** and a **BSc in Computer Science and Engineering** from Daffodil International University.

I work with **Python**, **SQL databases**, data analysis and **machine learning**, and I'm comfortable with web technologies (HTML, CSS, JavaScript). I've completed two machine learning research projects: detecting cyberbullying in Bangla social media comments, and predicting chronic kidney disease. I've also prepared AI/ML training data as a Data Annotator at Quantigo AI.

I'm looking for a role where I can apply my technical, analytical and problem-solving skills and contribute to the long-term success of the organization.

**Languages:** English (professional working proficiency) · Bangla (native)`,
  focus: "Data Analysis · ML · NLP",
  location: "Dhaka, Bangladesh",
  email: "zarirul.cse@gmail.com",
  phone: "+880 1863-063124",
  avatar_url: null,
  resume_url: "/Muhammad_Zarirul_Islam_Resume.pdf",
  available: true,
  years_experience: null,
  github: "https://github.com/ZarirulIslam",
  linkedin: "https://www.linkedin.com/in/zarirul-islam",
  kaggle: null,
  twitter: null,
  facebook: null,
};

const skill = (id: string, name: string, category: string, level: number, sort_order: number): Skill => ({
  id,
  name,
  category,
  level,
  sort_order,
});

export const seedSkills: Skill[] = [
  skill("sk1", "Python", "Programming", 85, 1),
  skill("sk2", "SQL", "Programming", 80, 2),
  skill("sk3", "JavaScript", "Programming", 65, 3),
  skill("sk4", "C", "Programming", 65, 4),
  skill("sk5", "Pandas", "Data Science & ML", 85, 5),
  skill("sk6", "NumPy", "Data Science & ML", 80, 6),
  skill("sk7", "Matplotlib & Seaborn", "Data Science & ML", 80, 7),
  skill("sk8", "Data Preprocessing", "Data Science & ML", 85, 8),
  skill("sk9", "Classification Models", "Data Science & ML", 80, 9),
  skill("sk10", "MySQL", "Databases", 75, 10),
  skill("sk11", "PostgreSQL", "Databases", 70, 11),
  skill("sk12", "MongoDB", "Databases", 60, 12),
  skill("sk13", "HTML", "Web Technologies", 80, 13),
  skill("sk14", "CSS", "Web Technologies", 75, 14),
  skill("sk15", "Bootstrap", "Web Technologies", 70, 15),
  skill("sk16", "Git & GitHub", "Tools", 75, 16),
  skill("sk17", "Supervisely", "Tools", 80, 17),
  skill("sk18", "Encord", "Tools", 75, 18),
];

export const seedProjects: Project[] = [
  {
    id: "p1",
    title: "Detecting Cyberbullying Against Bangladeshi Sportsmen",
    slug: "bangla-sports-cyberbullying-detection",
    summary:
      "MSc thesis: a classifier for cyberbullying in Bangla Facebook comments about sportsmen, trained on a custom dataset of 21,272 comments. Reached 84.53% accuracy.",
    content: `## Overview
My **MSc thesis**. It detects cyberbullying in Bangla social media comments aimed at Bangladeshi sportsmen.

## What I did
- Collected and curated a **custom dataset of 21,272 Bangla sports-related Facebook comments** for cyberbullying classification
- Preprocessed the Bangla text, then trained and compared classification models
- Built an **interactive application** that classifies a Bangla comment entered by the user

## Result
The selected classification model achieved **84.53% accuracy**.`,
    category: "Machine Learning · NLP",
    tech: ["Python", "NLP", "Machine Learning", "Bangla Text"],
    image_url: null,
    github_url: "https://github.com/ZarirulIslam/MSC_Thesis_Bangla_Sports_Cyberbullying_Detection",
    live_url: null,
    report_url: "https://drive.google.com/file/d/1zc4y8AAuht4aIICIpJV_yR2UUaxpX6ZF/view",
    featured: true,
    sort_order: 1,
  },
  {
    id: "p2",
    title: "Machine Learning Methods for Predicting Chronic Kidney Disease",
    slug: "chronic-kidney-disease-prediction",
    summary:
      "BSc thesis: machine learning models in Python that predict Chronic Kidney Disease with 99.16% accuracy.",
    content: `## Overview
My **BSc thesis**. It applies machine learning to predict **Chronic Kidney Disease (CKD)** from clinical data.

## What I did
- Performed **data preprocessing** and **feature analysis**
- Built and evaluated machine learning models in **Python**
- Contributed to the research, coding and technical report writing

## Result
The best model achieved **99.16% accuracy**.`,
    category: "Machine Learning",
    tech: ["Python", "Pandas", "Scikit-learn", "Data Preprocessing"],
    image_url: null,
    github_url: null,
    live_url: null,
    report_url: "https://drive.google.com/file/d/1GR4otjfdUvKVLvoIwD9tGI97eNh13k1U/view",
    featured: true,
    sort_order: 2,
  },
  {
    id: "p3",
    title: "Techolicbd.com Clone",
    slug: "techolicbd-clone",
    summary:
      "A rebuild of the Techolicbd.com website in HTML and CSS, focused on responsive design, clean code and performance.",
    content: `## Overview
A rebuild of the [techolicbd.com](https://techolicbd.com) website from scratch.

## Highlights
- Written in **HTML and CSS**
- Responsive layout for mobile, tablet and desktop
- Clean, maintainable code and a focus on performance`,
    category: "Web Development",
    tech: ["HTML", "CSS", "Responsive Design"],
    image_url: null,
    github_url: "https://github.com/ZarirulIslam/Techolicbd.com-clone",
    live_url: "https://zarirulislam.github.io/Techolicbd.com-clone/",
    report_url: null,
    featured: false,
    sort_order: 3,
  },
];

export const seedExperiences: Experience[] = [
  {
    id: "e1",
    kind: "work",
    title: "Data Annotator",
    organization: "Quantigo AI",
    location: "Dhaka, Bangladesh",
    start_date: "Jun 2023",
    end_date: "Oct 2023",
    description:
      "Labeled and categorized images for AI/ML training datasets using the Supervisely and Encord annotation platforms.",
    sort_order: 1,
  },
  {
    id: "e2",
    kind: "education",
    title: "MSc in Computer Science and Engineering (Major in Data Science)",
    organization: "Daffodil International University",
    location: "Dhaka, Bangladesh",
    start_date: "Jul 2024",
    end_date: "Jan 2026",
    description: "CGPA: 3.70 out of 4.00",
    sort_order: 2,
  },
  {
    id: "e3",
    kind: "education",
    title: "BSc in Computer Science and Engineering",
    organization: "Daffodil International University",
    location: "Dhaka, Bangladesh",
    start_date: "Jan 2019",
    end_date: "Jan 2024",
    description: "CGPA: 3.80 out of 4.00",
    sort_order: 3,
  },
  {
    id: "e4",
    kind: "volunteer",
    title: "Executive Member",
    organization: "DIU Computer and Programming Club (DIU CPC)",
    location: null,
    start_date: "Jan 2021",
    end_date: "Dec 2021",
    description: "Promoted club activities and helped organize club events.",
    sort_order: 4,
  },
  {
    id: "e5",
    kind: "volunteer",
    title: "Associate Member",
    organization: "DIU Computer and Programming Club (DIU CPC)",
    location: null,
    start_date: "Jan 2020",
    end_date: "Dec 2020",
    description: "Promoted club activities and helped organize club events.",
    sort_order: 5,
  },
  {
    id: "e6",
    kind: "volunteer",
    title: "Volunteer",
    organization: "National Girls' Programming Contest",
    location: null,
    start_date: "2021",
    end_date: "2021",
    description: "Supported event operations and assisted participants.",
    sort_order: 6,
  },
];

export const seedCertifications: Certification[] = [
  {
    id: "c1",
    kind: "certification",
    title: "Associate Data Analyst in Python",
    category: "Data Science",
    issuer: "DataCamp",
    date: null,
    credential_url: null,
    image_url: null,
    description: "Python, Pandas, NumPy, Matplotlib and Seaborn for data cleaning, preprocessing and data visualization.",
    sort_order: 1,
  },
  {
    id: "c2",
    kind: "certification",
    title: "Data Annotation",
    category: "Machine Learning & AI",
    issuer: "Quantigo AI",
    date: null,
    credential_url: null,
    image_url: null,
    description: "Image and video annotation techniques for AI/ML dataset preparation and labeling.",
    sort_order: 2,
  },
  {
    id: "c3",
    kind: "certification",
    title: "Career Development",
    category: "Professional Development",
    issuer: "Wadhwani Foundation",
    date: null,
    credential_url: null,
    image_url: null,
    description: "Career development, communication and workplace skills.",
    sort_order: 3,
  },
];

export const seedPosts: Post[] = [];
