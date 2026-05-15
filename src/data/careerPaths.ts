import {
  Code2, Server, Rocket, BarChart3, Smartphone, Cloud, Shield, Brain,
  Palette, Pen, Megaphone, DollarSign, Briefcase, Cpu, Database, Globe,
  Gamepad2, Camera, Music, Video, BookOpen, Stethoscope, Scale, Wrench,
  type LucideIcon,
} from "lucide-react";

export interface RoadmapStep {
  title: string;
  duration: string;
  topics: string[];
  resources: { label: string; url: string }[];
  project?: string;
}

export interface RoadmapPath {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  outcome: string;
  totalDuration: string;
  domain: "Tech" | "Data & AI" | "Design" | "Business" | "Creative" | "Other";
  /** quiz trait weights — used to score after assessment */
  traits: Partial<Record<TraitKey, number>>;
  steps: RoadmapStep[];
}

export type TraitKey =
  | "logic"        // problem-solving, math
  | "creative"     // visual / artistic
  | "people"       // communication, empathy
  | "build"        // hands-on shipping
  | "analyze"      // data, research
  | "system"       // architecture, infra
  | "lead"         // leadership, business
  | "explore";     // curiosity, learning new tech

export const TRAITS: { key: TraitKey; label: string; description: string }[] = [
  { key: "logic", label: "Logical Thinking", description: "Math, puzzles, algorithms" },
  { key: "creative", label: "Creativity", description: "Visual design, storytelling" },
  { key: "people", label: "People Skills", description: "Communication, empathy" },
  { key: "build", label: "Building Things", description: "Shipping products end-to-end" },
  { key: "analyze", label: "Analysis", description: "Patterns in data, research" },
  { key: "system", label: "Systems Thinking", description: "Architecture, infrastructure" },
  { key: "lead", label: "Leadership", description: "Strategy, business, growth" },
  { key: "explore", label: "Exploration", description: "Curiosity, new technology" },
];

const r = (label: string, url: string) => ({ label, url });

export const CAREER_PATHS: RoadmapPath[] = [
  // ============ TECH ============
  {
    id: "frontend", name: "Frontend Engineer", icon: Code2, color: "from-pink-500 to-rose-500",
    tagline: "Build delightful user interfaces with React + TypeScript.",
    outcome: "Junior Frontend / SDE-1 at a product company.",
    totalDuration: "5-7 months", domain: "Tech",
    traits: { logic: 3, creative: 3, build: 4, explore: 2 },
    steps: [
      { title: "Phase 1 — Web Foundations", duration: "3-4 weeks",
        topics: ["HTML5 semantics & accessibility", "CSS3, Flexbox, Grid", "Responsive design", "DevTools basics"],
        resources: [r("MDN Learn", "https://developer.mozilla.org/en-US/docs/Learn"), r("freeCodeCamp", "https://www.freecodecamp.org/learn/2022/responsive-web-design/")],
        project: "Personal portfolio (static, responsive)." },
      { title: "Phase 2 — JavaScript Mastery", duration: "5-6 weeks",
        topics: ["ES6+ syntax, modules", "Async/await, Fetch", "DOM manipulation", "Closures & prototypes"],
        resources: [r("JavaScript.info", "https://javascript.info/"), r("YDKJS", "https://github.com/getify/You-Dont-Know-JS")],
        project: "Weather + Todo apps." },
      { title: "Phase 3 — React + TypeScript", duration: "6-8 weeks",
        topics: ["Components, hooks, state", "Router, Context", "TypeScript generics", "Forms with zod"],
        resources: [r("React docs", "https://react.dev/learn"), r("Total TypeScript", "https://www.totaltypescript.com/tutorials")],
        project: "E-commerce front-end." },
      { title: "Phase 4 — Tooling & Styling", duration: "3-4 weeks",
        topics: ["Vite, ESLint", "Tailwind / shadcn", "TanStack Query", "Vitest + RTL"],
        resources: [r("Tailwind", "https://tailwindcss.com/docs"), r("TanStack Query", "https://tanstack.com/query/latest")],
        project: "Dashboard with auth + REST API." },
      { title: "Phase 5 — Performance & A11y", duration: "4-5 weeks",
        topics: ["Code splitting", "Web Vitals", "State machines", "WCAG"],
        resources: [r("web.dev", "https://web.dev/learn/performance"), r("Patterns.dev", "https://www.patterns.dev/")],
        project: "Open-source UI library contribution." },
      { title: "Phase 6 — Interview Prep", duration: "4-6 weeks",
        topics: ["DSA in JS", "Frontend system design", "3 portfolio projects", "Mock interviews"],
        resources: [r("Frontend Interview Handbook", "https://www.frontendinterviewhandbook.com/"), r("GreatFrontEnd", "https://www.greatfrontend.com/")] },
    ],
  },
  {
    id: "backend", name: "Backend Engineer", icon: Server, color: "from-emerald-500 to-teal-600",
    tagline: "Design scalable APIs, databases, and distributed systems.",
    outcome: "Backend SDE-1 at a product/SaaS company.",
    totalDuration: "6-8 months", domain: "Tech",
    traits: { logic: 4, system: 4, build: 3, analyze: 2 },
    steps: [
      { title: "Phase 1 — Programming Core", duration: "4-5 weeks",
        topics: ["Pick: Node / Python / Java / Go", "OOP & functional", "Git workflows", "Linux CLI"],
        resources: [r("Odin Project", "https://www.theodinproject.com/"), r("Roadmap.sh Backend", "https://roadmap.sh/backend")] },
      { title: "Phase 2 — APIs & HTTP", duration: "4 weeks",
        topics: ["REST principles", "Express/FastAPI/Spring", "JWT, OAuth", "Postman"],
        resources: [r("REST Tutorial", "https://restfulapi.net/"), r("FastAPI", "https://fastapi.tiangolo.com/")],
        project: "Notes API with auth." },
      { title: "Phase 3 — Databases", duration: "5-6 weeks",
        topics: ["SQL — joins, indexes", "PostgreSQL deep-dive", "Redis / Mongo", "Prisma / SQLAlchemy"],
        resources: [r("Use The Index, Luke", "https://use-the-index-luke.com/"), r("PG Tutorial", "https://www.postgresqltutorial.com/")],
        project: "Multi-tenant SaaS schema." },
      { title: "Phase 4 — System Design", duration: "5 weeks",
        topics: ["Caching", "Message queues", "Load balancing", "Microservices"],
        resources: [r("System Design Primer", "https://github.com/donnemartin/system-design-primer"), r("ByteByteGo", "https://blog.bytebytego.com/")] },
      { title: "Phase 5 — DevOps & Cloud", duration: "4 weeks",
        topics: ["Docker", "GitHub Actions CI/CD", "AWS basics", "Logging / monitoring"],
        resources: [r("Docker Curriculum", "https://docker-curriculum.com/"), r("AWS Free Tier", "https://aws.amazon.com/free/")],
        project: "Deploy containerized API to AWS." },
      { title: "Phase 6 — DSA + Interviews", duration: "6 weeks",
        topics: ["Arrays, hashmaps, trees", "Concurrency", "Design: URL shortener, chat", "Mock interviews"],
        resources: [r("NeetCode 150", "https://neetcode.io/practice"), r("Grokking SD", "https://www.designgurus.io/course/grokking-the-system-design-interview")] },
    ],
  },
  {
    id: "fullstack", name: "Full-Stack Engineer", icon: Rocket, color: "from-violet-500 to-fuchsia-500",
    tagline: "Ship end-to-end products from DB to pixel.", outcome: "Full-stack SDE / freelance / founder.",
    totalDuration: "7-9 months", domain: "Tech",
    traits: { logic: 3, build: 4, system: 3, explore: 3, lead: 2 },
    steps: [
      { title: "Phase 1 — Web + JS", duration: "5 weeks", topics: ["HTML, CSS, Tailwind", "JavaScript ES6+", "Git", "Terminal"],
        resources: [r("The Odin Project", "https://www.theodinproject.com/")] },
      { title: "Phase 2 — React + TS", duration: "6 weeks", topics: ["Hooks, Router", "TypeScript", "shadcn/ui", "TanStack Query"],
        resources: [r("React docs", "https://react.dev/")], project: "Twitter clone (mock API)." },
      { title: "Phase 3 — Node + DB", duration: "6 weeks", topics: ["Express / Hono / Next API", "Postgres + Prisma", "Auth (Supabase)", "Storage"],
        resources: [r("Supabase docs", "https://supabase.com/docs")], project: "Real Twitter clone." },
      { title: "Phase 4 — Production", duration: "4 weeks", topics: ["Vercel deploys", "Stripe", "Email flows", "Sentry"],
        resources: [r("Stripe docs", "https://stripe.com/docs")] },
      { title: "Phase 5 — Scaling", duration: "4 weeks", topics: ["Docker", "GitHub Actions", "Redis caching", "System design"],
        resources: [r("System Design Primer", "https://github.com/donnemartin/system-design-primer")] },
      { title: "Phase 6 — Job Hunt", duration: "5 weeks", topics: ["3 SaaS projects", "Blind 75", "Resume + LinkedIn", "Outreach"],
        resources: [r("NeetCode", "https://neetcode.io/practice")] },
    ],
  },
  {
    id: "mobile", name: "Mobile Developer", icon: Smartphone, color: "from-orange-500 to-red-500",
    tagline: "Ship cross-platform apps with React Native / Flutter.",
    outcome: "Mobile SDE-1 at a product startup.", totalDuration: "5-7 months", domain: "Tech",
    traits: { logic: 3, creative: 2, build: 4, explore: 2 },
    steps: [
      { title: "Programming Foundation", duration: "4 weeks", topics: ["JavaScript / Dart", "Async", "Git", "REST"],
        resources: [r("JavaScript.info", "https://javascript.info/")] },
      { title: "Pick a Framework", duration: "6 weeks", topics: ["RN OR Flutter", "Navigation", "State", "Native UI"],
        resources: [r("React Native", "https://reactnative.dev/"), r("Flutter codelabs", "https://docs.flutter.dev/codelabs")],
        project: "TMDB movie app." },
      { title: "Backend & Auth", duration: "4 weeks", topics: ["Firebase / Supabase", "Push notifications", "Offline storage", "OAuth"],
        resources: [r("Firebase", "https://firebase.google.com/docs")] },
      { title: "Polish & Native", duration: "4 weeks", topics: ["Animations", "Native modules", "Profiling", "Splash & icons"],
        resources: [r("Reanimated", "https://docs.swmansion.com/react-native-reanimated/")] },
      { title: "Publish & Grow", duration: "3 weeks", topics: ["Play / App Store", "EAS CI/CD", "Analytics", "ASO"],
        resources: [r("Expo EAS", "https://docs.expo.dev/eas/")], project: "Publish 1 app." },
      { title: "Interviews", duration: "4 weeks", topics: ["DSA refresh", "Mobile system design", "Portfolio polish", "Mocks"],
        resources: [r("NeetCode", "https://neetcode.io/")] },
    ],
  },
  {
    id: "devops", name: "DevOps / Cloud Engineer", icon: Cloud, color: "from-sky-500 to-cyan-500",
    tagline: "Automate infra, CI/CD, and cloud-native deploys.",
    outcome: "Junior DevOps / SRE / Cloud Engineer.", totalDuration: "6-8 months", domain: "Tech",
    traits: { logic: 3, system: 4, analyze: 2, build: 2 },
    steps: [
      { title: "Linux + Networking", duration: "4 weeks", topics: ["Bash", "Permissions, processes", "TCP/IP, DNS, HTTP", "SSH, systemd"],
        resources: [r("Linux Journey", "https://linuxjourney.com/")] },
      { title: "Git + Programming", duration: "3 weeks", topics: ["Git workflows", "Python or Go", "REST", "YAML/JSON"],
        resources: [r("Pro Git", "https://git-scm.com/book/en/v2")] },
      { title: "Docker + Kubernetes", duration: "6 weeks", topics: ["Dockerfiles", "Compose", "K8s core", "Helm"],
        resources: [r("K8s docs", "https://kubernetes.io/docs/tutorials/"), r("KodeKloud", "https://kodekloud.com/")] },
      { title: "CI/CD", duration: "3 weeks", topics: ["GitHub Actions", "GitLab/Jenkins", "Pipelines", "Secrets"],
        resources: [r("GH Actions", "https://docs.github.com/en/actions")] },
      { title: "Cloud + IaC", duration: "6 weeks", topics: ["AWS core", "Terraform", "Prometheus/Grafana", "ELK/Loki"],
        resources: [r("Terraform", "https://developer.hashicorp.com/terraform/tutorials"), r("AWS CCP", "https://aws.amazon.com/certification/certified-cloud-practitioner/")],
        project: "3-tier app on EKS via Terraform." },
      { title: "Certs + Job", duration: "4 weeks", topics: ["AWS SAA / CKA", "Incident response", "Resume", "Mocks"],
        resources: [r("CKA curriculum", "https://github.com/cncf/curriculum")] },
    ],
  },
  {
    id: "security", name: "Cybersecurity Analyst", icon: Shield, color: "from-rose-600 to-red-700",
    tagline: "Hunt vulnerabilities, defend systems, respond to incidents.",
    outcome: "SOC Analyst / Security Engineer entry role.", totalDuration: "6-8 months", domain: "Tech",
    traits: { logic: 4, analyze: 4, system: 3, explore: 3 },
    steps: [
      { title: "IT + Networking", duration: "5 weeks", topics: ["OSI / TCP-IP", "Linux + Windows admin", "Active Directory", "Wireshark"],
        resources: [r("Professor Messer", "https://www.professormesser.com/")] },
      { title: "Security Foundations", duration: "4 weeks", topics: ["CIA triad", "Cryptography", "AuthN/Z", "Security+ syllabus"],
        resources: [r("Security+", "https://www.comptia.org/certifications/security")] },
      { title: "Offensive (Red)", duration: "6 weeks", topics: ["OWASP Top 10", "Burp Suite", "Linux privesc", "nmap"],
        resources: [r("TryHackMe", "https://tryhackme.com/"), r("PortSwigger Academy", "https://portswigger.net/web-security")],
        project: "30+ THM rooms + walkthroughs." },
      { title: "Defensive (Blue)", duration: "4 weeks", topics: ["SIEM (Splunk/ELK)", "IR playbooks", "Threat intel", "Log analysis"],
        resources: [r("Blue Team Labs", "https://blueteamlabs.online/")] },
      { title: "Cloud + Scripting", duration: "4 weeks", topics: ["AWS/Azure security", "Python for sec", "Bash automation", "IAM"],
        resources: [r("Cybr", "https://cybr.com/")] },
      { title: "Certs + Job", duration: "5 weeks", topics: ["Security+ / eJPT", "HackTheBox", "Writeups", "Mocks"],
        resources: [r("HackTheBox", "https://www.hackthebox.com/")] },
    ],
  },
  {
    id: "gamedev", name: "Game Developer", icon: Gamepad2, color: "from-purple-500 to-indigo-600",
    tagline: "Build games with Unity / Unreal / Godot.",
    outcome: "Junior Gameplay / Tools Programmer.", totalDuration: "8-10 months", domain: "Tech",
    traits: { logic: 3, creative: 4, build: 4, explore: 3 },
    steps: [
      { title: "Programming Basics", duration: "5 weeks", topics: ["C# (Unity) or C++ (Unreal)", "OOP", "Math: vectors, linear algebra", "Git"],
        resources: [r("Brackeys YouTube", "https://www.youtube.com/@Brackeys"), r("learncpp.com", "https://www.learncpp.com/")] },
      { title: "Engine Fundamentals", duration: "8 weeks", topics: ["Scenes & GameObjects", "Physics & collisions", "Input & UI", "Animation"],
        resources: [r("Unity Learn", "https://learn.unity.com/"), r("Unreal docs", "https://dev.epicgames.com/documentation/en-us/unreal-engine")],
        project: "2D platformer." },
      { title: "Game Design", duration: "4 weeks", topics: ["Game loops", "Level design", "Player feedback", "Playtesting"],
        resources: [r("Game Maker's Toolkit", "https://www.youtube.com/@GMTK")] },
      { title: "3D + Shaders", duration: "6 weeks", topics: ["3D math", "Lighting", "Shader basics (HLSL/GLSL)", "VFX"],
        resources: [r("Catlike Coding", "https://catlikecoding.com/unity/tutorials/")] },
      { title: "Multiplayer / Tools", duration: "5 weeks", topics: ["Networking basics", "Editor tools", "Performance profiling", "Save systems"],
        resources: [r("Mirror docs", "https://mirror-networking.gitbook.io/docs")] },
      { title: "Ship & Portfolio", duration: "8 weeks", topics: ["Polish a vertical slice", "Itch.io / Steam release", "Devlog", "Job apps"],
        resources: [r("itch.io", "https://itch.io/")], project: "Ship 1 polished game." },
    ],
  },
  {
    id: "embedded", name: "Embedded / IoT Engineer", icon: Cpu, color: "from-amber-600 to-orange-700",
    tagline: "Program microcontrollers and connected devices.",
    outcome: "Junior Embedded / Firmware Engineer.", totalDuration: "7-9 months", domain: "Tech",
    traits: { logic: 4, system: 3, build: 3, analyze: 2 },
    steps: [
      { title: "C / C++ Foundations", duration: "6 weeks", topics: ["Pointers & memory", "Bit manipulation", "Data structures in C", "Make / CMake"],
        resources: [r("learncpp.com", "https://www.learncpp.com/")] },
      { title: "Electronics Basics", duration: "4 weeks", topics: ["Ohm's law", "Digital logic", "Oscilloscope & multimeter", "PCB basics"],
        resources: [r("All About Circuits", "https://www.allaboutcircuits.com/")] },
      { title: "Microcontrollers", duration: "6 weeks", topics: ["Arduino → STM32", "GPIO, ADC, PWM", "Interrupts & timers", "UART/SPI/I2C"],
        resources: [r("STM32 docs", "https://www.st.com/en/development-tools/stm32cubeide.html")],
        project: "Sensor logger over I2C." },
      { title: "RTOS", duration: "4 weeks", topics: ["FreeRTOS tasks", "Scheduling", "Queues & semaphores", "ISR-safe code"],
        resources: [r("FreeRTOS book", "https://www.freertos.org/Documentation/RTOS_book.html")] },
      { title: "IoT & Connectivity", duration: "5 weeks", topics: ["BLE / WiFi / LoRa", "MQTT", "Cloud (AWS IoT)", "OTA updates"],
        resources: [r("MQTT Essentials", "https://www.hivemq.com/mqtt-essentials/")] },
      { title: "Portfolio + Job", duration: "5 weeks", topics: ["2 hardware projects", "Schematic + firmware on GitHub", "Interview prep", "Resume"],
        resources: [r("KiCad", "https://www.kicad.org/")] },
    ],
  },

  // ============ DATA & AI ============
  {
    id: "data-science", name: "Data Scientist", icon: BarChart3, color: "from-blue-500 to-indigo-600",
    tagline: "Turn data into decisions with statistics + ML.",
    outcome: "Junior Data Scientist / Analyst.", totalDuration: "7-9 months", domain: "Data & AI",
    traits: { logic: 4, analyze: 4, explore: 3 },
    steps: [
      { title: "Python + Math", duration: "5 weeks", topics: ["Python, NumPy", "Linear algebra", "Probability & stats", "Pandas"],
        resources: [r("Python for Everybody", "https://www.coursera.org/specializations/python"), r("Khan Stats", "https://www.khanacademy.org/math/statistics-probability")] },
      { title: "SQL + EDA", duration: "4 weeks", topics: ["Joins, window functions", "Data cleaning", "Matplotlib + Seaborn", "Storytelling"],
        resources: [r("Mode SQL", "https://mode.com/sql-tutorial")], project: "Kaggle EDA." },
      { title: "Machine Learning", duration: "6 weeks", topics: ["Regression / classification", "Trees, XGBoost", "Cross-val", "Feature engineering"],
        resources: [r("Andrew Ng ML", "https://www.coursera.org/specializations/machine-learning-introduction")], project: "Kaggle submission." },
      { title: "Deep Learning", duration: "5 weeks", topics: ["Neural nets", "PyTorch", "CNNs", "NLP / Transformers intro"],
        resources: [r("fast.ai", "https://course.fast.ai/")] },
      { title: "MLOps", duration: "4 weeks", topics: ["MLflow", "FastAPI serving", "Docker deploy", "Drift monitoring"],
        resources: [r("Made With ML", "https://madewithml.com/")] },
      { title: "Portfolio + Interviews", duration: "5 weeks", topics: ["3 GitHub projects", "Case studies", "SQL + DSA", "Kaggle"],
        resources: [r("DataLemur", "https://datalemur.com/")] },
    ],
  },
  {
    id: "data-analyst", name: "Data Analyst", icon: Database, color: "from-cyan-500 to-blue-500",
    tagline: "SQL, dashboards, and business insights.",
    outcome: "Junior Data / Business Analyst.", totalDuration: "4-6 months", domain: "Data & AI",
    traits: { analyze: 4, logic: 3, people: 2, lead: 2 },
    steps: [
      { title: "Excel + Stats", duration: "3 weeks", topics: ["Pivot tables, formulas", "Descriptive stats", "Hypothesis testing basics", "Sampling"],
        resources: [r("Excel by ExcelIsFun", "https://www.youtube.com/@excelisfun")] },
      { title: "SQL Mastery", duration: "5 weeks", topics: ["SELECT, JOIN, GROUP BY", "Window functions", "CTEs & subqueries", "Performance"],
        resources: [r("Mode SQL", "https://mode.com/sql-tutorial"), r("DataLemur", "https://datalemur.com/")] },
      { title: "Visualization", duration: "4 weeks", topics: ["Tableau OR Power BI", "Dashboard design", "Storytelling with data", "Color & UX"],
        resources: [r("Storytelling with Data", "https://www.storytellingwithdata.com/")], project: "Sales dashboard." },
      { title: "Python for Data", duration: "4 weeks", topics: ["Pandas", "Cleaning", "Plotly", "Automation"],
        resources: [r("Pandas docs", "https://pandas.pydata.org/docs/")] },
      { title: "Business + A/B Testing", duration: "3 weeks", topics: ["Funnels & cohorts", "A/B tests", "KPIs & metrics", "Stakeholder mgmt"],
        resources: [r("Trustworthy Online Experiments (book)", "https://experimentguide.com/")] },
      { title: "Portfolio + Job", duration: "4 weeks", topics: ["3 dashboards on GitHub/Tableau Public", "Resume", "SQL interview practice", "LinkedIn"],
        resources: [r("Tableau Public", "https://public.tableau.com/")] },
    ],
  },
  {
    id: "ai-engineer", name: "AI / ML Engineer", icon: Brain, color: "from-fuchsia-500 to-pink-600",
    tagline: "Build LLM apps, RAG, and production ML systems.",
    outcome: "Junior AI / ML Engineer.", totalDuration: "7-9 months", domain: "Data & AI",
    traits: { logic: 4, analyze: 3, build: 3, explore: 4, system: 2 },
    steps: [
      { title: "Python + ML Basics", duration: "5 weeks", topics: ["NumPy, Pandas", "Scikit-learn", "Stats fundamentals", "Linear algebra"],
        resources: [r("Andrew Ng ML", "https://www.coursera.org/specializations/machine-learning-introduction")] },
      { title: "Deep Learning", duration: "6 weeks", topics: ["PyTorch", "CNNs, RNNs", "Transformers", "Fine-tuning"],
        resources: [r("fast.ai", "https://course.fast.ai/"), r("HF course", "https://huggingface.co/learn")] },
      { title: "LLM Apps & RAG", duration: "5 weeks", topics: ["Prompt engineering", "Embeddings & vector DBs", "RAG pipelines", "Agents & tools"],
        resources: [r("LangChain docs", "https://python.langchain.com/docs/"), r("OpenAI cookbook", "https://github.com/openai/openai-cookbook")],
        project: "RAG chatbot over your docs." },
      { title: "MLOps", duration: "4 weeks", topics: ["FastAPI serving", "Docker", "Model registry", "Eval & monitoring"],
        resources: [r("Made With ML", "https://madewithml.com/")] },
      { title: "Distributed + Cloud", duration: "4 weeks", topics: ["GPU basics", "Ray / Modal", "AWS Sagemaker", "Cost optimization"],
        resources: [r("Modal docs", "https://modal.com/docs")] },
      { title: "Portfolio + Job", duration: "5 weeks", topics: ["2 production AI apps", "Open-source contribution", "Interview prep", "Resume"],
        resources: [r("Eugene Yan blog", "https://eugeneyan.com/")] },
    ],
  },
  {
    id: "data-engineer", name: "Data Engineer", icon: Database, color: "from-teal-500 to-emerald-600",
    tagline: "Build pipelines, warehouses, and data platforms.",
    outcome: "Junior Data Engineer.", totalDuration: "6-8 months", domain: "Data & AI",
    traits: { logic: 3, system: 4, analyze: 3, build: 2 },
    steps: [
      { title: "Python + SQL", duration: "5 weeks", topics: ["Python core", "Advanced SQL", "Linux CLI", "Git"],
        resources: [r("Mode SQL", "https://mode.com/sql-tutorial")] },
      { title: "Data Modeling + Warehousing", duration: "4 weeks", topics: ["Star/Snowflake schema", "OLTP vs OLAP", "Snowflake/BigQuery", "dbt basics"],
        resources: [r("dbt Learn", "https://courses.getdbt.com/")] },
      { title: "ETL / ELT + Orchestration", duration: "5 weeks", topics: ["Airflow", "Pipeline patterns", "CDC", "Data quality"],
        resources: [r("Airflow tutorial", "https://airflow.apache.org/docs/apache-airflow/stable/tutorial.html")],
        project: "Daily ETL with Airflow + dbt." },
      { title: "Streaming + Big Data", duration: "5 weeks", topics: ["Kafka", "Spark", "Lakehouse (Delta/Iceberg)", "Parquet"],
        resources: [r("Kafka quickstart", "https://kafka.apache.org/quickstart")] },
      { title: "Cloud + IaC", duration: "4 weeks", topics: ["AWS S3 / Glue / Redshift", "Terraform", "Cost monitoring", "Security"],
        resources: [r("AWS Data analytics", "https://aws.amazon.com/big-data/datalakes-and-analytics/")] },
      { title: "Portfolio + Job", duration: "4 weeks", topics: ["End-to-end platform repo", "Resume", "System design (data)", "Mocks"],
        resources: [r("Designing Data-Intensive Apps (book)", "https://dataintensive.net/")] },
    ],
  },

  // ============ DESIGN ============
  {
    id: "ui-ux", name: "UI / UX Designer", icon: Palette, color: "from-pink-400 to-fuchsia-500",
    tagline: "Design intuitive, beautiful product experiences.",
    outcome: "Junior Product / UX Designer.", totalDuration: "5-7 months", domain: "Design",
    traits: { creative: 4, people: 3, build: 2, analyze: 2 },
    steps: [
      { title: "Design Principles", duration: "4 weeks", topics: ["Visual hierarchy", "Typography", "Color theory", "Gestalt"],
        resources: [r("Refactoring UI", "https://www.refactoringui.com/"), r("Material Design", "https://m3.material.io/")] },
      { title: "Figma Mastery", duration: "4 weeks", topics: ["Components & variants", "Auto-layout", "Prototyping", "Design systems"],
        resources: [r("Figma Academy", "https://www.figma.com/academy/")], project: "Clone a popular app UI." },
      { title: "UX Research", duration: "4 weeks", topics: ["User interviews", "Personas, journeys", "Usability testing", "Surveys"],
        resources: [r("NN/g articles", "https://www.nngroup.com/articles/")] },
      { title: "Interaction & Motion", duration: "3 weeks", topics: ["Microinteractions", "Lottie / Rive", "Accessibility (WCAG)", "Mobile patterns"],
        resources: [r("Rive", "https://rive.app/")] },
      { title: "Design Systems", duration: "4 weeks", topics: ["Tokens", "Atomic design", "Documentation", "Handoff to devs"],
        resources: [r("Polaris", "https://polaris.shopify.com/")] },
      { title: "Portfolio + Job", duration: "5 weeks", topics: ["3 case studies", "Behance / Dribbble", "Networking", "Mock interviews"],
        resources: [r("Case study guide", "https://growth.design/case-studies")] },
    ],
  },
  {
    id: "graphic-designer", name: "Graphic Designer", icon: Pen, color: "from-rose-400 to-orange-400",
    tagline: "Create brands, illustrations, and visual identity.",
    outcome: "Junior Graphic / Brand Designer.", totalDuration: "5-6 months", domain: "Design",
    traits: { creative: 4, people: 2, build: 2 },
    steps: [
      { title: "Design Fundamentals", duration: "4 weeks", topics: ["Composition", "Typography", "Color", "Layout grids"],
        resources: [r("The Futur YouTube", "https://www.youtube.com/@thefutur")] },
      { title: "Adobe / Affinity Suite", duration: "5 weeks", topics: ["Photoshop", "Illustrator", "InDesign", "Affinity alternatives"],
        resources: [r("Adobe tutorials", "https://helpx.adobe.com/")] },
      { title: "Branding", duration: "4 weeks", topics: ["Logo design", "Brand guidelines", "Identity systems", "Mood boards"],
        resources: [r("Logo Design Love (book)", "https://www.logodesignlove.com/book")] },
      { title: "Print + Digital", duration: "3 weeks", topics: ["Print prep & CMYK", "Social templates", "Web banners", "Packaging"],
        resources: [r("Canva Design School", "https://www.canva.com/designschool/")] },
      { title: "Illustration + Motion", duration: "4 weeks", topics: ["Vector illustration", "After Effects basics", "Lottie", "Storyboarding"],
        resources: [r("School of Motion", "https://www.schoolofmotion.com/")] },
      { title: "Portfolio + Clients", duration: "4 weeks", topics: ["Behance/Dribbble", "Pricing & contracts", "Cold outreach", "Upwork/Fiverr"],
        resources: [r("Behance", "https://www.behance.net/")] },
    ],
  },
  {
    id: "motion-3d", name: "Motion / 3D Designer", icon: Video, color: "from-purple-500 to-pink-500",
    tagline: "Bring brands and products to life with motion.",
    outcome: "Junior Motion Designer / 3D Artist.", totalDuration: "6-8 months", domain: "Design",
    traits: { creative: 4, build: 3, explore: 2 },
    steps: [
      { title: "Design Foundations", duration: "3 weeks", topics: ["Composition", "Typography", "Color", "Storyboarding"],
        resources: [r("School of Motion", "https://www.schoolofmotion.com/")] },
      { title: "After Effects", duration: "6 weeks", topics: ["Keyframes & easing", "Shape layers", "Expressions", "Title sequences"],
        resources: [r("AE basics", "https://helpx.adobe.com/after-effects/tutorials.html")] },
      { title: "3D — Blender", duration: "6 weeks", topics: ["Modeling", "Materials & lighting", "Animation", "Rendering"],
        resources: [r("Blender Guru donut", "https://www.youtube.com/@blenderguru")], project: "Branded 3D loop." },
      { title: "Cinema 4D / Houdini intro", duration: "4 weeks", topics: ["Mograph", "Procedural", "Octane/Redshift", "Compositing"],
        resources: [r("Greyscalegorilla", "https://greyscalegorilla.com/")] },
      { title: "Sound + Edit", duration: "3 weeks", topics: ["Premiere Pro", "Sound design", "Color grading", "Export pipelines"],
        resources: [r("Premiere tutorials", "https://helpx.adobe.com/premiere-pro/tutorials.html")] },
      { title: "Reel + Clients", duration: "4 weeks", topics: ["Demo reel", "Behance", "Freelance pricing", "Studios outreach"],
        resources: [r("Motionographer", "https://motionographer.com/")] },
    ],
  },

  // ============ BUSINESS ============
  {
    id: "product-manager", name: "Product Manager", icon: Briefcase, color: "from-indigo-500 to-blue-600",
    tagline: "Discover, define, and ship valuable products.",
    outcome: "Associate Product Manager (APM).", totalDuration: "6-8 months", domain: "Business",
    traits: { people: 4, lead: 4, analyze: 3, build: 2 },
    steps: [
      { title: "Product Foundations", duration: "4 weeks", topics: ["What PMs do", "Product lifecycle", "Frameworks (RICE, JTBD)", "Stakeholders"],
        resources: [r("Inspired by Marty Cagan", "https://svpg.com/inspired-how-to-create-products-customers-love/")] },
      { title: "User Research + Discovery", duration: "4 weeks", topics: ["User interviews", "Opportunity solution trees", "Personas", "Validating ideas"],
        resources: [r("Continuous Discovery Habits", "https://www.producttalk.org/")] },
      { title: "Analytics + Metrics", duration: "4 weeks", topics: ["AARRR funnel", "SQL basics", "A/B testing", "North star metric"],
        resources: [r("Mode SQL", "https://mode.com/sql-tutorial"), r("Reforge", "https://www.reforge.com/")] },
      { title: "Design + Tech Literacy", duration: "3 weeks", topics: ["Wireframing in Figma", "How web/mobile works", "APIs basics", "Design systems"],
        resources: [r("Figma Academy", "https://www.figma.com/academy/")] },
      { title: "Strategy + Roadmaps", duration: "4 weeks", topics: ["Vision & strategy", "Roadmap craft", "OKRs", "Prioritization"],
        resources: [r("Lenny's Newsletter", "https://www.lennysnewsletter.com/")] },
      { title: "PM Interviews + Job", duration: "5 weeks", topics: ["Product sense", "Estimation", "Execution & metrics", "Behavioral"],
        resources: [r("Decode and Conquer (book)", "https://www.amazon.com/dp/0615930417"), r("Exponent", "https://www.tryexponent.com/")] },
    ],
  },
  {
    id: "digital-marketer", name: "Digital Marketer", icon: Megaphone, color: "from-yellow-500 to-orange-500",
    tagline: "Drive growth through SEO, ads, content & email.",
    outcome: "Junior Marketing / Growth Associate.", totalDuration: "4-6 months", domain: "Business",
    traits: { creative: 3, people: 3, analyze: 3, lead: 2 },
    steps: [
      { title: "Marketing Foundations", duration: "3 weeks", topics: ["Funnel + AARRR", "Positioning", "ICP & personas", "Brand basics"],
        resources: [r("HubSpot Academy", "https://academy.hubspot.com/")] },
      { title: "SEO + Content", duration: "4 weeks", topics: ["Keyword research", "On-page SEO", "Link building", "Editorial calendar"],
        resources: [r("Ahrefs Academy", "https://ahrefs.com/academy"), r("Backlinko", "https://backlinko.com/")] },
      { title: "Paid Ads", duration: "4 weeks", topics: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Creative testing"],
        resources: [r("Google Skillshop", "https://skillshop.exceedlms.com/")] },
      { title: "Email + Lifecycle", duration: "3 weeks", topics: ["Newsletters", "Drip campaigns", "Segmentation", "Deliverability"],
        resources: [r("Really Good Emails", "https://reallygoodemails.com/")] },
      { title: "Analytics + CRO", duration: "3 weeks", topics: ["GA4", "Tag Manager", "Heatmaps", "A/B testing"],
        resources: [r("GA4 docs", "https://developers.google.com/analytics")] },
      { title: "Portfolio + Job", duration: "3 weeks", topics: ["1 case study per channel", "Personal blog/Twitter", "Resume", "Interviews"],
        resources: [r("Demand Curve", "https://www.demandcurve.com/")] },
    ],
  },
  {
    id: "finance-analyst", name: "Finance Analyst", icon: DollarSign, color: "from-green-600 to-emerald-700",
    tagline: "Model, forecast, and analyze company financials.",
    outcome: "Junior Financial / Investment Analyst.", totalDuration: "6-8 months", domain: "Business",
    traits: { logic: 3, analyze: 4, lead: 2 },
    steps: [
      { title: "Accounting Basics", duration: "4 weeks", topics: ["3 statements", "Debits/credits", "Ratios", "GAAP vs IFRS"],
        resources: [r("CFI free", "https://corporatefinanceinstitute.com/")] },
      { title: "Excel for Finance", duration: "4 weeks", topics: ["Lookups", "Pivot tables", "Macros & VBA basics", "Shortcuts"],
        resources: [r("Wall Street Prep free", "https://www.wallstreetprep.com/")] },
      { title: "Financial Modeling", duration: "5 weeks", topics: ["3-statement model", "DCF", "LBO basics", "Comparable companies"],
        resources: [r("Macabacus", "https://macabacus.com/")] },
      { title: "Valuation + Markets", duration: "4 weeks", topics: ["Equity vs debt", "Valuation methods", "Capital markets", "Macroeconomics"],
        resources: [r("Damodaran online", "https://pages.stern.nyu.edu/~adamodar/")] },
      { title: "Tools — SQL + BI", duration: "3 weeks", topics: ["SQL", "Power BI / Tableau", "Python basics", "FactSet/Bloomberg"],
        resources: [r("Mode SQL", "https://mode.com/sql-tutorial")] },
      { title: "CFA + Job", duration: "5 weeks", topics: ["CFA L1 prep", "Resume", "Networking + LinkedIn", "Mock interviews"],
        resources: [r("CFA Institute", "https://www.cfainstitute.org/")] },
    ],
  },
  {
    id: "entrepreneur", name: "Founder / Entrepreneur", icon: Rocket, color: "from-amber-500 to-red-500",
    tagline: "Validate, build, and grow your own company.",
    outcome: "Solo founder / co-founder of an MVP startup.", totalDuration: "Ongoing", domain: "Business",
    traits: { lead: 4, build: 4, people: 3, explore: 3 },
    steps: [
      { title: "Idea + Customer Discovery", duration: "4 weeks", topics: ["Mom Test interviews", "Problem-solution fit", "ICP", "Competitive landscape"],
        resources: [r("The Mom Test (book)", "https://www.momtestbook.com/")] },
      { title: "MVP Build", duration: "6 weeks", topics: ["No-code or Lovable/Bubble", "Pricing & landing page", "Stripe payments", "Analytics"],
        resources: [r("Lovable docs", "https://docs.lovable.dev/")], project: "Ship a paid MVP." },
      { title: "Go-to-Market", duration: "4 weeks", topics: ["Cold outreach", "ProductHunt launch", "Content / SEO", "Communities"],
        resources: [r("Demand Curve", "https://www.demandcurve.com/")] },
      { title: "Sales + Retention", duration: "4 weeks", topics: ["Discovery calls", "Onboarding", "Support", "Churn analysis"],
        resources: [r("Predictable Revenue", "https://predictablerevenue.com/")] },
      { title: "Fundraising (optional)", duration: "4 weeks", topics: ["Bootstrap vs VC", "Pitch deck", "YC application", "Term sheets"],
        resources: [r("YC Startup School", "https://www.startupschool.org/")] },
      { title: "Scale + Hire", duration: "Ongoing", topics: ["Hiring first 5", "Culture & ops", "Metrics dashboard", "Repeat the loop"],
        resources: [r("First Round Review", "https://review.firstround.com/")] },
    ],
  },

  // ============ CREATIVE / OTHER ============
  {
    id: "content-creator", name: "Content Creator", icon: Camera, color: "from-pink-500 to-purple-600",
    tagline: "Build an audience on YouTube / Instagram / TikTok.",
    outcome: "Self-employed creator with monetized channel.", totalDuration: "6-12 months", domain: "Creative",
    traits: { creative: 4, people: 3, build: 2, lead: 2, explore: 2 },
    steps: [
      { title: "Niche + Audience", duration: "2 weeks", topics: ["Pick a niche", "Research competitors", "Define avatar viewer", "Content pillars"],
        resources: [r("Think Media", "https://www.youtube.com/@ThinkMediaTV")] },
      { title: "Filming + Audio", duration: "3 weeks", topics: ["Camera/phone setup", "Lighting basics", "Mic choice", "Framing"],
        resources: [r("DSLR Video Shooter", "https://www.youtube.com/@DSLRVideoShooter")] },
      { title: "Editing", duration: "4 weeks", topics: ["Premiere or DaVinci Resolve", "Pacing & cuts", "Captions", "Thumbnails in Figma"],
        resources: [r("DaVinci Resolve free", "https://www.blackmagicdesign.com/products/davinciresolve")] },
      { title: "Algorithm + Posting", duration: "4 weeks", topics: ["YouTube SEO", "Hooks & retention", "Posting cadence", "Analytics"],
        resources: [r("VidIQ", "https://vidiq.com/")] },
      { title: "Monetization", duration: "4 weeks", topics: ["AdSense", "Sponsorships", "Affiliate links", "Digital products"],
        resources: [r("Creator Now", "https://www.creatornow.co/")] },
      { title: "Scale + Team", duration: "Ongoing", topics: ["Hiring an editor", "Repurposing to Shorts/Reels", "Email list", "Community"],
        resources: [r("ConvertKit", "https://convertkit.com/")] },
    ],
  },
  {
    id: "writer", name: "Technical Writer / Copywriter", icon: BookOpen, color: "from-slate-500 to-zinc-700",
    tagline: "Communicate clearly through writing — docs, copy, blogs.",
    outcome: "Junior Technical Writer / Copywriter.", totalDuration: "4-6 months", domain: "Creative",
    traits: { creative: 3, people: 3, analyze: 2 },
    steps: [
      { title: "Writing Fundamentals", duration: "3 weeks", topics: ["Plain English", "Structure (PAS, AIDA)", "Editing", "Style guides"],
        resources: [r("On Writing Well (book)", "https://www.harpercollins.com/products/on-writing-well-william-zinsser")] },
      { title: "Niche — Tech or Marketing", duration: "3 weeks", topics: ["Pick: docs vs marketing copy", "Audience research", "Voice & tone", "Brand guidelines"],
        resources: [r("Write the Docs", "https://www.writethedocs.org/")] },
      { title: "Tools", duration: "3 weeks", topics: ["Markdown / Docusaurus", "Grammarly / Hemingway", "Notion / Google Docs", "Figma for assets"],
        resources: [r("Docusaurus", "https://docusaurus.io/")] },
      { title: "SEO + Distribution", duration: "3 weeks", topics: ["Keyword research", "On-page SEO", "Email newsletters", "LinkedIn"],
        resources: [r("Ahrefs Academy", "https://ahrefs.com/academy")] },
      { title: "Portfolio", duration: "4 weeks", topics: ["10 published pieces", "Open-source docs PRs", "Personal blog", "Case studies"],
        resources: [r("Hashnode", "https://hashnode.com/")] },
      { title: "Clients + Job", duration: "3 weeks", topics: ["Cold pitching", "Upwork / Contra", "Pricing", "Long-term retainers"],
        resources: [r("Contra", "https://contra.com/")] },
    ],
  },
  {
    id: "doctor", name: "Doctor / MBBS Aspirant", icon: Stethoscope, color: "from-red-500 to-rose-600",
    tagline: "Pursue medicine — NEET, MBBS, residency, specialization.",
    outcome: "Licensed physician (5.5y MBBS + 3y MD/MS).", totalDuration: "8-10 years", domain: "Other",
    traits: { logic: 3, analyze: 3, people: 4, lead: 2 },
    steps: [
      { title: "NEET / Pre-Med Prep", duration: "12 months", topics: ["Physics, Chemistry, Biology", "NCERT mastery", "Mock tests", "Time management"],
        resources: [r("NEETprep", "https://www.neetprep.com/"), r("Khan Academy MCAT", "https://www.khanacademy.org/test-prep/mcat")] },
      { title: "MBBS Year 1-2 (Pre-clinical)", duration: "2 years", topics: ["Anatomy", "Physiology", "Biochemistry", "Cadaver dissection"],
        resources: [r("Kenhub", "https://www.kenhub.com/"), r("Osmosis", "https://www.osmosis.org/")] },
      { title: "MBBS Year 3 (Para-clinical)", duration: "1 year", topics: ["Pathology", "Pharmacology", "Microbiology", "Forensic"],
        resources: [r("Pathoma", "https://www.pathoma.com/")] },
      { title: "Clinical Years 4-5", duration: "2 years", topics: ["Medicine, Surgery, OBGYN, Pediatrics", "Bedside skills", "Case presentations", "Clinical rotations"],
        resources: [r("UpToDate", "https://www.uptodate.com/")] },
      { title: "Internship", duration: "1 year", topics: ["Rotating internship", "Procedures", "Emergency duty", "Patient management"],
        resources: [r("BMJ Best Practice", "https://bestpractice.bmj.com/")] },
      { title: "PG Entrance + Specialty", duration: "3+ years", topics: ["NEET-PG / INI-CET", "Choose MD/MS specialty", "Residency", "Subspecialty fellowship"],
        resources: [r("Marrow", "https://www.marrow.com/"), r("PrepLadder", "https://www.prepladder.com/")] },
    ],
  },
  {
    id: "lawyer", name: "Lawyer / Advocate", icon: Scale, color: "from-stone-600 to-amber-800",
    tagline: "Practice law — litigation, corporate, or judiciary.",
    outcome: "Practicing advocate / corporate lawyer.", totalDuration: "5-7 years", domain: "Other",
    traits: { logic: 4, people: 4, analyze: 3, lead: 3 },
    steps: [
      { title: "CLAT / Entrance Prep", duration: "12 months", topics: ["English & comprehension", "Legal reasoning", "Logical reasoning", "GK & current affairs"],
        resources: [r("LawSikho free resources", "https://lawsikho.com/")] },
      { title: "Law Foundation (Year 1-2)", duration: "2 years", topics: ["Constitution", "Contract law", "Torts", "Legal methods"],
        resources: [r("Indian Kanoon", "https://indiankanoon.org/")] },
      { title: "Core Subjects (Year 3-4)", duration: "2 years", topics: ["IPC / CrPC / CPC", "Property & Family law", "Corporate law", "Moot courts"],
        resources: [r("SCC Online", "https://www.scconline.com/")] },
      { title: "Internships + Final Year", duration: "1 year", topics: ["Litigation, Corporate, NGO", "Drafting & research", "Specialization choice", "Bar Council prep"],
        resources: [r("Live Law", "https://www.livelaw.in/")] },
      { title: "AIBE + Practice", duration: "6-12 months", topics: ["All India Bar Exam", "Junior to a senior advocate", "Court procedure", "Client handling"],
        resources: [r("Bar Council of India", "https://www.barcouncilofindia.org/")] },
      { title: "Specialize / LLM", duration: "1-2 years", topics: ["LLM (optional)", "Judiciary OR firm OR corporate", "Build network", "Publish articles"],
        resources: [r("SSRN", "https://www.ssrn.com/")] },
    ],
  },
  {
    id: "civil-services", name: "Civil Services (UPSC)", icon: Globe, color: "from-orange-600 to-amber-700",
    tagline: "Crack UPSC and serve as IAS / IPS / IFS.",
    outcome: "Officer in the Indian Civil Services.", totalDuration: "1-3 years prep", domain: "Other",
    traits: { logic: 3, analyze: 3, people: 3, lead: 4 },
    steps: [
      { title: "Foundation + NCERTs", duration: "3 months", topics: ["NCERT Class 6-12", "Indian Polity (Laxmikanth)", "Modern History (Spectrum)", "Geography basics"],
        resources: [r("PMF IAS", "https://www.pmfias.com/"), r("NCERT books", "https://ncert.nic.in/")] },
      { title: "GS Mains Subjects", duration: "6 months", topics: ["GS 1-4 syllabus", "Ethics case studies", "Economy (Sanjeev Verma)", "International relations"],
        resources: [r("Insights IAS", "https://www.insightsonindia.com/")] },
      { title: "Optional Subject", duration: "4 months", topics: ["Pick optional", "Make notes", "Previous year papers", "Test series"],
        resources: [r("Forum IAS", "https://forumias.com/")] },
      { title: "Current Affairs + Newspaper", duration: "Ongoing", topics: ["Daily The Hindu", "Monthly compilation", "Yojana / Kurukshetra", "PIB"],
        resources: [r("PIB", "https://www.pib.gov.in/")] },
      { title: "Prelims Test Series", duration: "3 months", topics: ["Vision IAS / Insights tests", "CSAT practice", "Revision rounds", "PYQs"],
        resources: [r("Vision IAS", "https://visionias.in/")] },
      { title: "Mains Answer Writing + Interview", duration: "4 months", topics: ["Daily answer writing", "Essay practice", "Mock interviews (DAF)", "Personality dev"],
        resources: [r("Mrunal", "https://mrunal.org/")] },
      { title: "Trade / Vocational Skill", duration: "Ongoing", topics: ["Hands-on practice", "Apprenticeship", "Tools mastery", "Safety standards"],
        resources: [r("Skill India", "https://www.skillindia.gov.in/")] },
    ],
  },
  {
    id: "music-producer", name: "Music Producer", icon: Music, color: "from-violet-600 to-indigo-700",
    tagline: "Produce, mix, and release music professionally.",
    outcome: "Self-employed producer / studio engineer.", totalDuration: "6-12 months", domain: "Creative",
    traits: { creative: 4, build: 3, explore: 2 },
    steps: [
      { title: "Music Theory Basics", duration: "3 weeks", topics: ["Scales & chords", "Rhythm", "Song structure", "Ear training"],
        resources: [r("musictheory.net", "https://www.musictheory.net/")] },
      { title: "DAW Mastery", duration: "5 weeks", topics: ["Pick: Ableton / FL / Logic", "MIDI & audio", "Synths & samplers", "Routing"],
        resources: [r("Ableton Learn", "https://learningmusic.ableton.com/")] },
      { title: "Sound Design", duration: "4 weeks", topics: ["Synthesis", "Drum design", "Sampling", "Vocal chops"],
        resources: [r("Syntorial", "https://www.syntorial.com/")] },
      { title: "Mixing", duration: "4 weeks", topics: ["EQ, compression", "Reverb & delay", "Bus processing", "Reference tracks"],
        resources: [r("Mix With The Masters", "https://mixwiththemasters.com/")] },
      { title: "Mastering + Release", duration: "3 weeks", topics: ["Loudness (LUFS)", "Stereo imaging", "DistroKid release", "Spotify for Artists"],
        resources: [r("DistroKid", "https://distrokid.com/")] },
      { title: "Brand + Clients", duration: "Ongoing", topics: ["Instagram/YouTube presence", "Beat selling", "Sync licensing", "Collabs"],
        resources: [r("BeatStars", "https://www.beatstars.com/")] },
    ],
  },
  {
    id: "trades", name: "Skilled Trades (Electrician/Plumber/etc.)", icon: Wrench, color: "from-yellow-700 to-orange-800",
    tagline: "Hands-on skilled work — high demand, no degree needed.",
    outcome: "Certified tradesperson with steady income.", totalDuration: "1-3 years", domain: "Other",
    traits: { build: 4, logic: 2, system: 2 },
    steps: [
      { title: "Choose a Trade", duration: "2 weeks", topics: ["Electrician, Plumber, Welder, HVAC, Carpenter", "Local demand research", "Income expectations", "Required certifications"],
        resources: [r("BLS occupational handbook", "https://www.bls.gov/ooh/")] },
      { title: "ITI / Vocational Course", duration: "1-2 years", topics: ["Theory classes", "Workshop practice", "Safety (OSHA / electrical codes)", "Tool mastery"],
        resources: [r("ITI India", "https://dgt.gov.in/")] },
      { title: "Apprenticeship", duration: "1-2 years", topics: ["On-the-job training under licensed pro", "Real client work", "Codes & inspections", "Customer service"],
        resources: [r("Apprenticeship.gov", "https://www.apprenticeship.gov/")] },
      { title: "Licensing + Certification", duration: "3-6 months", topics: ["State / national license exam", "Specialty certifications", "Insurance + bonding", "Business registration"],
        resources: [r("NCCER", "https://www.nccer.org/")] },
      { title: "Independent Work", duration: "Ongoing", topics: ["Pricing your work", "Local SEO + Google Business", "Reviews on Yelp/Justdial", "Estimates & invoicing"],
        resources: [r("Jobber", "https://getjobber.com/")] },
      { title: "Scale to a Team", duration: "Ongoing", topics: ["Hire apprentices", "Service area expansion", "Specialization (smart-home, solar)", "Long-term contracts"],
        resources: [r("Skill India", "https://www.skillindia.gov.in/")] },
    ],
  },
];

/* =================== QUIZ =================== */

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { label: string; traits: Partial<Record<TraitKey, number>> }[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What kind of project sounds most exciting to you on a free Saturday?",
    options: [
      { label: "Solving a tricky math/logic puzzle or coding a small algorithm", traits: { logic: 3, analyze: 1 } },
      { label: "Designing a beautiful poster, app screen, or short video", traits: { creative: 3, build: 1 } },
      { label: "Hosting a meetup, debate, or helping a friend prep for an interview", traits: { people: 3, lead: 1 } },
      { label: "Building a working gadget, app, or product from scratch", traits: { build: 3, explore: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "When you get a new gadget or app, you usually…",
    options: [
      { label: "Read benchmarks and compare specs in a spreadsheet", traits: { analyze: 3, logic: 1 } },
      { label: "Take it apart or look up how it works under the hood", traits: { system: 2, explore: 2 } },
      { label: "Use it to make something cool to share online", traits: { creative: 2, build: 2 } },
      { label: "Tell everyone you know if it's good or bad", traits: { people: 2, lead: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "Which school subject did you actually enjoy?",
    options: [
      { label: "Math / Physics / CS", traits: { logic: 3, system: 1 } },
      { label: "Biology / Chemistry / Statistics", traits: { analyze: 3, logic: 1 } },
      { label: "Art / Design / Literature / Music", traits: { creative: 3 } },
      { label: "Civics / Economics / Business Studies", traits: { lead: 2, people: 2, analyze: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "In a group project, you naturally end up as the…",
    options: [
      { label: "Person who plans, delegates and keeps things on track", traits: { lead: 3, people: 1 } },
      { label: "Person who actually builds the deliverable", traits: { build: 3 } },
      { label: "Person who designs the slides and presents", traits: { creative: 2, people: 2 } },
      { label: "Person who researches and finds the right answer", traits: { analyze: 3, explore: 1 } },
    ],
  },
  {
    id: "q5",
    prompt: "Which problem would you most love to spend a week on?",
    options: [
      { label: "Make a slow website 10× faster", traits: { logic: 2, system: 3 } },
      { label: "Find why customers churn and what to fix", traits: { analyze: 3, lead: 1 } },
      { label: "Redesign a confusing app screen so users smile", traits: { creative: 3, people: 1 } },
      { label: "Launch a small product and get the first 100 users", traits: { build: 2, lead: 2, people: 1 } },
    ],
  },
  {
    id: "q6",
    prompt: "How do you prefer to learn something new?",
    options: [
      { label: "Read deep technical docs and write notes", traits: { logic: 2, analyze: 2 } },
      { label: "Watch tutorials and build along", traits: { build: 3, explore: 1 } },
      { label: "Talk to experts and ask lots of questions", traits: { people: 2, explore: 2 } },
      { label: "Try a bold experiment and see what breaks", traits: { explore: 3, build: 1 } },
    ],
  },
  {
    id: "q7",
    prompt: "Pick the kind of work environment you'd thrive in:",
    options: [
      { label: "Quiet, deep-focus work with clear technical problems", traits: { logic: 2, system: 2 } },
      { label: "Collaborative studio with whiteboards and sketches", traits: { creative: 3, people: 1 } },
      { label: "Fast-paced startup shipping new things weekly", traits: { build: 3, lead: 1, explore: 1 } },
      { label: "Research lab or data-rich corporate role", traits: { analyze: 3, logic: 1 } },
    ],
  },
  {
    id: "q8",
    prompt: "Which weekend hobby tempts you the most?",
    options: [
      { label: "Competitive programming / chess / Rubik's cube", traits: { logic: 3 } },
      { label: "Photography / drawing / making short films", traits: { creative: 3 } },
      { label: "Volunteering / coaching / public speaking", traits: { people: 3, lead: 1 } },
      { label: "Tinkering with electronics, 3D printing, or DIY", traits: { build: 2, system: 2, explore: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "If you had ₹1L to start something, you'd most likely…",
    options: [
      { label: "Build a small SaaS / app side-project", traits: { build: 3, lead: 2 } },
      { label: "Invest it after researching the market", traits: { analyze: 3, logic: 1 } },
      { label: "Buy gear (camera, instruments, design software)", traits: { creative: 3 } },
      { label: "Take a course / certification you've wanted", traits: { explore: 3 } },
    ],
  },
  {
    id: "q10",
    prompt: "Which of these would feel like a 'dream win' in 5 years?",
    options: [
      { label: "Senior engineer at a top product company", traits: { logic: 2, system: 2, build: 1 } },
      { label: "Lead designer with award-winning portfolio", traits: { creative: 3, people: 1 } },
      { label: "Founder or product leader of a growing company", traits: { lead: 3, build: 1, people: 1 } },
      { label: "Respected expert / researcher in your field", traits: { analyze: 2, explore: 2, logic: 1 } },
    ],
  },
];

export function scoreQuiz(answers: Record<string, number>): {
  traitScores: Record<TraitKey, number>;
  topPaths: { path: RoadmapPath; score: number }[];
} {
  const traitScores: Record<TraitKey, number> = {
    logic: 0, creative: 0, people: 0, build: 0, analyze: 0, system: 0, lead: 0, explore: 0,
  };

  for (const q of QUIZ) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const opt = q.options[idx];
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.traits)) {
      traitScores[k as TraitKey] += v ?? 0;
    }
  }

  const ranked = CAREER_PATHS
    .map((path) => {
      let score = 0;
      let max = 0;
      for (const [k, w] of Object.entries(path.traits)) {
        const weight = w ?? 0;
        score += (traitScores[k as TraitKey] ?? 0) * weight;
        max += weight * 12; // rough normalization
      }
      const norm = max > 0 ? Math.round((score / max) * 100) : 0;
      return { path, score: Math.min(99, Math.max(20, norm)) };
    })
    .sort((a, b) => b.score - a.score);

  return { traitScores, topPaths: ranked };
}
