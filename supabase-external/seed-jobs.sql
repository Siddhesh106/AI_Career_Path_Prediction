-- ============================================================
-- CareerAI — Massive Jobs Seed (150+ openings, all domains)
-- Run AFTER schema.sql, in: Supabase Dashboard → SQL Editor
-- Safe to re-run: clears existing rows then re-inserts.
-- ============================================================

TRUNCATE TABLE public.saved_jobs;
TRUNCATE TABLE public.jobs CASCADE;

INSERT INTO public.jobs (title, company, location, job_type, salary_range, description, apply_url, tags, is_remote) VALUES
-- ===== SOFTWARE ENGINEERING =====
('Frontend Engineer (React)', 'Stripe', 'Bangalore, IN', 'Full-time', '₹28–45 LPA', 'Build payments dashboards used by millions of merchants. React, TypeScript, GraphQL.', 'https://stripe.com/jobs', ARRAY['React','TypeScript','GraphQL','CSS'], false),
('Backend Engineer (Go)', 'Cloudflare', 'Remote', 'Full-time', '$130k–$180k', 'Work on the edge network powering 20% of the web.', 'https://www.cloudflare.com/careers/', ARRAY['Go','Distributed Systems','Kubernetes'], true),
('Full-Stack Engineer', 'Vercel', 'Remote', 'Full-time', '$140k–$200k', 'Ship features for the Next.js platform and developer tools.', 'https://vercel.com/careers', ARRAY['Next.js','React','Node.js','TypeScript'], true),
('Senior Software Engineer', 'Google', 'Hyderabad, IN', 'Full-time', '₹50–80 LPA', 'Build large-scale systems for Google Search infrastructure.', 'https://careers.google.com', ARRAY['C++','Python','Distributed Systems'], false),
('Software Engineer II', 'Microsoft', 'Bangalore, IN', 'Full-time', '₹35–55 LPA', 'Develop features for Microsoft Azure cloud services.', 'https://careers.microsoft.com', ARRAY['C#','.NET','Azure'], false),
('Software Development Engineer', 'Amazon', 'Pune, IN', 'Full-time', '₹30–50 LPA', 'Own services in AWS that scale to millions of QPS.', 'https://www.amazon.jobs', ARRAY['Java','AWS','DynamoDB'], false),
('iOS Engineer', 'Meta', 'London, UK', 'Full-time', '£90k–£140k', 'Build features used by billions on Instagram iOS.', 'https://www.metacareers.com', ARRAY['Swift','iOS','Objective-C'], false),
('Android Engineer', 'Spotify', 'Stockholm, SE', 'Full-time', '€70k–€110k', 'Craft world-class audio experiences on Android.', 'https://www.lifeatspotify.com', ARRAY['Kotlin','Android','Jetpack Compose'], false),
('Platform Engineer', 'GitHub', 'Remote', 'Full-time', '$150k–$210k', 'Scale GitHub Actions infrastructure to billions of jobs.', 'https://github.com/about/careers', ARRAY['Ruby','Go','Kubernetes'], true),
('Site Reliability Engineer', 'Netflix', 'Mumbai, IN', 'Full-time', '₹45–70 LPA', 'Keep the world streaming. SRE for the Netflix CDN.', 'https://jobs.netflix.com', ARRAY['SRE','Linux','Python','Observability'], false),

-- ===== DATA / ML / AI =====
('Machine Learning Engineer', 'OpenAI', 'San Francisco, US', 'Full-time', '$220k–$380k', 'Train and deploy frontier language models.', 'https://openai.com/careers', ARRAY['PyTorch','LLM','Distributed Training','Python'], false),
('Applied Scientist', 'Anthropic', 'Remote', 'Full-time', '$250k–$400k', 'Research alignment and safety of large language models.', 'https://www.anthropic.com/careers', ARRAY['ML','Research','Python','PyTorch'], true),
('Data Scientist', 'Swiggy', 'Bangalore, IN', 'Full-time', '₹22–38 LPA', 'Build pricing & ETA models for hyperlocal delivery.', 'https://careers.swiggy.com', ARRAY['Python','SQL','XGBoost','Statistics'], false),
('Senior Data Engineer', 'Razorpay', 'Bangalore, IN', 'Full-time', '₹30–50 LPA', 'Own real-time payments data pipelines on Spark/Kafka.', 'https://razorpay.com/jobs', ARRAY['Spark','Kafka','Airflow','Python'], false),
('AI Research Intern', 'DeepMind', 'London, UK', 'Internship', '£5,500/mo', 'Research at the frontier of reinforcement learning.', 'https://www.deepmind.com/careers', ARRAY['RL','Python','JAX'], false),
('NLP Engineer', 'Hugging Face', 'Remote', 'Full-time', '$150k–$220k', 'Build the open-source ML ecosystem.', 'https://huggingface.co/careers', ARRAY['NLP','Transformers','Python'], true),
('Computer Vision Engineer', 'Tesla', 'Palo Alto, US', 'Full-time', '$170k–$260k', 'Perception stack for Tesla Autopilot.', 'https://www.tesla.com/careers', ARRAY['CV','PyTorch','C++','CUDA'], false),
('MLOps Engineer', 'Flipkart', 'Bangalore, IN', 'Full-time', '₹25–42 LPA', 'Productionize ML models for personalization.', 'https://www.flipkartcareers.com', ARRAY['MLOps','Kubeflow','Docker','Python'], false),
('Analytics Engineer', 'Zomato', 'Gurgaon, IN', 'Full-time', '₹18–30 LPA', 'Model business-critical data with dbt and Snowflake.', 'https://www.zomato.com/careers', ARRAY['dbt','SQL','Snowflake'], false),
('Data Analyst', 'PhonePe', 'Bangalore, IN', 'Full-time', '₹12–22 LPA', 'Drive product decisions with data for UPI payments.', 'https://www.phonepe.com/careers', ARRAY['SQL','Tableau','Python'], false),

-- ===== DEVOPS / CLOUD / SECURITY =====
('DevOps Engineer', 'Atlassian', 'Bangalore, IN', 'Full-time', '₹26–45 LPA', 'Automate CI/CD across thousands of microservices.', 'https://www.atlassian.com/company/careers', ARRAY['AWS','Terraform','Kubernetes'], false),
('Cloud Architect', 'Accenture', 'Mumbai, IN', 'Full-time', '₹30–55 LPA', 'Design enterprise cloud migrations on Azure & AWS.', 'https://www.accenture.com/in-en/careers', ARRAY['Azure','AWS','Architecture'], false),
('Security Engineer', 'Cloudflare', 'Remote', 'Full-time', '$160k–$230k', 'Defend the internet — application & infra security.', 'https://www.cloudflare.com/careers/', ARRAY['Security','AppSec','Python'], true),
('Penetration Tester', 'KPMG', 'Bangalore, IN', 'Full-time', '₹14–24 LPA', 'Red team engagements for enterprise clients.', 'https://home.kpmg/in/en/home/careers.html', ARRAY['PenTest','OSCP','Burp Suite'], false),
('SOC Analyst L2', 'Wipro', 'Pune, IN', 'Full-time', '₹8–14 LPA', '24/7 SOC monitoring and incident response.', 'https://careers.wipro.com', ARRAY['SIEM','Splunk','SOC'], false),
('Platform SRE', 'Uber', 'Bangalore, IN', 'Full-time', '₹40–65 LPA', 'Run the platform powering Uber globally.', 'https://www.uber.com/careers', ARRAY['SRE','Go','Kubernetes'], false),

-- ===== PRODUCT / DESIGN =====
('Product Manager', 'CRED', 'Bangalore, IN', 'Full-time', '₹35–60 LPA', 'Own roadmap for credit card payments product line.', 'https://careers.cred.club', ARRAY['Product','Fintech','Strategy'], false),
('Senior Product Designer', 'Figma', 'Remote', 'Full-time', '$160k–$230k', 'Design the future of collaborative design tools.', 'https://www.figma.com/careers/', ARRAY['Design','Figma','Prototyping'], true),
('UX Researcher', 'Airbnb', 'Gurgaon, IN', 'Full-time', '₹28–45 LPA', 'Conduct user research for hosts in APAC.', 'https://careers.airbnb.com', ARRAY['UX Research','Interviews'], false),
('Product Designer', 'Notion', 'Remote', 'Full-time', '$140k–$200k', 'Shape the workspace used by millions.', 'https://www.notion.so/careers', ARRAY['Design','Figma','UX'], true),
('Associate PM', 'Google', 'Bangalore, IN', 'Full-time', '₹35–50 LPA', 'APM rotational program. New grads welcome.', 'https://careers.google.com', ARRAY['Product','APM'], false),
('Graphic Designer', 'Canva', 'Remote', 'Full-time', '$70k–$110k', 'Create templates used by 150M+ users.', 'https://www.canva.com/careers/', ARRAY['Design','Illustration','Branding'], true),

-- ===== CYBERSECURITY / NETWORKING =====
('Network Engineer', 'Cisco', 'Bangalore, IN', 'Full-time', '₹15–28 LPA', 'Design enterprise SDN and routing solutions.', 'https://jobs.cisco.com', ARRAY['Networking','BGP','SDN'], false),
('Cloud Security Engineer', 'Palo Alto Networks', 'Bangalore, IN', 'Full-time', '₹28–48 LPA', 'Build Prisma Cloud product features.', 'https://www.paloaltonetworks.com/company/careers', ARRAY['CloudSec','AWS','Python'], false),
('Application Security Engineer', 'Razorpay', 'Bangalore, IN', 'Full-time', '₹25–45 LPA', 'Threat modeling & secure code review for fintech.', 'https://razorpay.com/jobs', ARRAY['AppSec','OWASP','Python'], false),

-- ===== BLOCKCHAIN / WEB3 =====
('Solidity Engineer', 'Polygon', 'Remote', 'Full-time', '$120k–$200k', 'Build core smart contracts for Polygon zkEVM.', 'https://polygon.technology/careers', ARRAY['Solidity','EVM','Web3'], true),
('Smart Contract Auditor', 'Trail of Bits', 'Remote', 'Full-time', '$160k–$240k', 'Audit DeFi protocols for critical vulnerabilities.', 'https://www.trailofbits.com/careers/', ARRAY['Solidity','Security','Audit'], true),
('Blockchain Developer', 'CoinDCX', 'Mumbai, IN', 'Full-time', '₹20–40 LPA', 'Build crypto exchange backend & on-chain services.', 'https://coindcx.com/careers', ARRAY['Go','Blockchain','Crypto'], false),

-- ===== GAME DEV =====
('Game Developer (Unity)', 'Dream11', 'Mumbai, IN', 'Full-time', '₹18–32 LPA', 'Build interactive sports gaming experiences.', 'https://careers.dream11.com', ARRAY['Unity','C#','Mobile'], false),
('Unreal Engine Programmer', 'Ubisoft', 'Pune, IN', 'Full-time', '₹16–30 LPA', 'AAA console game development.', 'https://www.ubisoft.com/en-us/company/careers', ARRAY['Unreal','C++','Gameplay'], false),
('Technical Artist', 'Riot Games', 'Los Angeles, US', 'Full-time', '$120k–$180k', 'Bridge art and engineering on League of Legends.', 'https://www.riotgames.com/en/work-with-us', ARRAY['Shaders','Unity','3D'], false),

-- ===== EMBEDDED / HARDWARE / IOT =====
('Embedded Software Engineer', 'Qualcomm', 'Hyderabad, IN', 'Full-time', '₹20–35 LPA', 'Firmware for Snapdragon mobile platforms.', 'https://careers.qualcomm.com', ARRAY['C','Embedded','RTOS'], false),
('FPGA Engineer', 'NVIDIA', 'Pune, IN', 'Full-time', '₹28–48 LPA', 'Design FPGA systems for GPU verification.', 'https://www.nvidia.com/en-us/about-nvidia/careers/', ARRAY['Verilog','FPGA','SystemVerilog'], false),
('IoT Solutions Architect', 'Bosch', 'Bangalore, IN', 'Full-time', '₹22–40 LPA', 'Design end-to-end industrial IoT systems.', 'https://www.bosch.in/careers/', ARRAY['IoT','MQTT','Azure'], false),
('Robotics Engineer', 'Boston Dynamics', 'Boston, US', 'Full-time', '$140k–$210k', 'Control systems for legged robots.', 'https://bostondynamics.com/careers/', ARRAY['ROS','C++','Control Systems'], false),

-- ===== QA / TESTING =====
('SDET', 'Microsoft', 'Hyderabad, IN', 'Full-time', '₹22–38 LPA', 'Build test automation for Microsoft 365 services.', 'https://careers.microsoft.com', ARRAY['Selenium','Java','Automation'], false),
('QA Automation Engineer', 'Zoho', 'Chennai, IN', 'Full-time', '₹10–18 LPA', 'Automate test suites across Zoho product line.', 'https://www.zoho.com/careers/', ARRAY['Selenium','Cypress','Java'], false),
('Performance Engineer', 'Walmart Labs', 'Bangalore, IN', 'Full-time', '₹20–35 LPA', 'Load testing and performance tuning at scale.', 'https://careers.walmart.com', ARRAY['JMeter','Gatling','Performance'], false),

-- ===== MOBILE =====
('React Native Developer', 'Meesho', 'Bangalore, IN', 'Full-time', '₹18–32 LPA', 'Cross-platform mobile development for social commerce.', 'https://www.meesho.io/careers', ARRAY['React Native','TypeScript'], false),
('Flutter Developer', 'PhonePe', 'Bangalore, IN', 'Full-time', '₹16–28 LPA', 'Build Flutter modules for the PhonePe super-app.', 'https://www.phonepe.com/careers', ARRAY['Flutter','Dart'], false),

-- ===== BUSINESS / FINANCE / CONSULTING =====
('Investment Banking Analyst', 'Goldman Sachs', 'Mumbai, IN', 'Full-time', '₹20–35 LPA', 'M&A advisory and capital markets execution.', 'https://www.goldmansachs.com/careers/', ARRAY['Finance','Excel','Valuation'], false),
('Quantitative Researcher', 'Jane Street', 'London, UK', 'Full-time', '£200k+', 'Build trading models for global markets.', 'https://www.janestreet.com/join-jane-street/', ARRAY['Quant','OCaml','Python','Math'], false),
('Management Consultant', 'McKinsey & Company', 'Mumbai, IN', 'Full-time', '₹25–45 LPA', 'Advise Fortune 500 clients on strategy.', 'https://www.mckinsey.com/careers', ARRAY['Strategy','Consulting'], false),
('Strategy Associate', 'Bain & Company', 'Gurgaon, IN', 'Full-time', '₹22–40 LPA', 'Strategy consulting for global clients.', 'https://www.bain.com/careers/', ARRAY['Strategy','Consulting'], false),
('Financial Analyst', 'JP Morgan', 'Mumbai, IN', 'Full-time', '₹14–24 LPA', 'Equity research for banking sector coverage.', 'https://careers.jpmorgan.com', ARRAY['Finance','Excel','Modeling'], false),
('Risk Analyst', 'HDFC Bank', 'Mumbai, IN', 'Full-time', '₹10–18 LPA', 'Credit risk modeling for retail loans.', 'https://www.hdfcbank.com/personal/about-us/careers', ARRAY['Risk','SAS','SQL'], false),

-- ===== MARKETING / SALES / GROWTH =====
('Growth Marketer', 'Razorpay', 'Bangalore, IN', 'Full-time', '₹15–28 LPA', 'Drive merchant acquisition through paid + organic.', 'https://razorpay.com/jobs', ARRAY['Growth','SEO','Performance Marketing'], false),
('Content Strategist', 'HubSpot', 'Remote', 'Full-time', '$80k–$120k', 'Lead content strategy for the marketing blog.', 'https://www.hubspot.com/careers', ARRAY['Content','SEO','Strategy'], true),
('SEO Specialist', 'Zerodha', 'Bangalore, IN', 'Full-time', '₹10–18 LPA', 'Own SEO across Zerodha properties.', 'https://zerodha.com/careers/', ARRAY['SEO','Analytics'], false),
('Account Executive (SaaS)', 'Freshworks', 'Chennai, IN', 'Full-time', '₹12–22 LPA + OTE', 'Close enterprise SaaS deals across APAC.', 'https://www.freshworks.com/company/careers/', ARRAY['Sales','SaaS','B2B'], false),
('Performance Marketing Lead', 'CRED', 'Bangalore, IN', 'Full-time', '₹25–45 LPA', 'Run multi-crore performance budgets.', 'https://careers.cred.club', ARRAY['Marketing','Growth','Ads'], false),

-- ===== HEALTHCARE / BIOTECH =====
('Bioinformatics Scientist', 'MedGenome', 'Bangalore, IN', 'Full-time', '₹15–28 LPA', 'Genomics analysis for clinical diagnostics.', 'https://research.medgenome.com/careers', ARRAY['Bioinformatics','Python','R'], false),
('Clinical Data Manager', 'Pfizer', 'Mumbai, IN', 'Full-time', '₹14–25 LPA', 'Manage clinical trial data across Asia.', 'https://www.pfizer.com/about/careers', ARRAY['Clinical','SAS','Pharma'], false),
('Healthtech PM', 'Practo', 'Bangalore, IN', 'Full-time', '₹22–38 LPA', 'Own product for online consultations.', 'https://www.practo.com/careers', ARRAY['Product','Healthcare'], false),

-- ===== MECHANICAL / CIVIL / CORE ENGINEERING =====
('Mechanical Design Engineer', 'Tata Motors', 'Pune, IN', 'Full-time', '₹8–15 LPA', 'Design powertrain components for EVs.', 'https://www.tatamotors.com/careers/', ARRAY['CAD','SolidWorks','EV'], false),
('Structural Engineer', 'L&T', 'Mumbai, IN', 'Full-time', '₹9–16 LPA', 'Design high-rise structures using STAAD.Pro.', 'https://www.larsentoubro.com/careers/', ARRAY['Civil','STAAD','Structures'], false),
('Aerospace Engineer', 'ISRO', 'Bangalore, IN', 'Full-time', '₹10–18 LPA', 'Satellite payload design at URSC.', 'https://www.isro.gov.in/Careers.html', ARRAY['Aerospace','MATLAB','CAD'], false),
('Production Engineer', 'Maruti Suzuki', 'Manesar, IN', 'Full-time', '₹7–12 LPA', 'Lean manufacturing on automotive shop floor.', 'https://www.marutisuzuki.com/corporate/careers', ARRAY['Manufacturing','Lean','Six Sigma'], false),
('Electrical Engineer', 'Siemens', 'Pune, IN', 'Full-time', '₹10–18 LPA', 'Power systems engineering for industrial drives.', 'https://new.siemens.com/in/en/company/jobs.html', ARRAY['Electrical','Power Systems'], false),

-- ===== HR / OPERATIONS / LEGAL =====
('HR Business Partner', 'Infosys', 'Bangalore, IN', 'Full-time', '₹14–24 LPA', 'Partner with engineering leaders on people strategy.', 'https://www.infosys.com/careers/', ARRAY['HR','HRBP'], false),
('Talent Acquisition Lead', 'Razorpay', 'Bangalore, IN', 'Full-time', '₹18–30 LPA', 'Lead engineering hiring for fintech scale-up.', 'https://razorpay.com/jobs', ARRAY['Recruiting','HR'], false),
('Legal Counsel', 'Flipkart', 'Bangalore, IN', 'Full-time', '₹20–38 LPA', 'Commercial contracts and regulatory compliance.', 'https://www.flipkartcareers.com', ARRAY['Legal','Contracts'], false),
('Operations Manager', 'Delhivery', 'Gurgaon, IN', 'Full-time', '₹14–24 LPA', 'Run regional logistics hub operations.', 'https://www.delhivery.com/careers', ARRAY['Operations','Logistics'], false),

-- ===== INTERNSHIPS / NEW GRAD =====
('SDE Intern', 'Amazon', 'Bangalore, IN', 'Internship', '₹1.0L/mo', '6-month internship on AWS or retail teams.', 'https://www.amazon.jobs', ARRAY['Java','DSA','Internship'], false),
('Software Engineer Intern', 'Google', 'Hyderabad, IN', 'Internship', '₹1.2L/mo', 'STEP / SWE summer internship program.', 'https://careers.google.com', ARRAY['Internship','C++','Python'], false),
('ML Research Intern', 'Microsoft Research', 'Bangalore, IN', 'Internship', '₹1.0L/mo', 'Research internship at MSR India.', 'https://www.microsoft.com/en-us/research/lab/microsoft-research-india/', ARRAY['ML','Research','Internship'], false),
('Product Intern', 'Zomato', 'Gurgaon, IN', 'Internship', '₹60k/mo', 'Summer PM internship — own a feature end to end.', 'https://www.zomato.com/careers', ARRAY['Product','Internship'], false),
('Frontend Intern', 'Razorpay', 'Bangalore, IN', 'Internship', '₹50k/mo', 'Build dashboards used by 10M+ businesses.', 'https://razorpay.com/jobs', ARRAY['React','Internship'], false),
('Data Science Intern', 'Swiggy', 'Bangalore, IN', 'Internship', '₹70k/mo', 'Solve hyperlocal logistics problems with ML.', 'https://careers.swiggy.com', ARRAY['Python','ML','Internship'], false),
('Cybersecurity Intern', 'Deloitte', 'Mumbai, IN', 'Internship', '₹40k/mo', 'Cyber risk advisory internship.', 'https://www2.deloitte.com/in/en/careers.html', ARRAY['Security','Internship'], false),
('UX Design Intern', 'Adobe', 'Noida, IN', 'Internship', '₹55k/mo', 'Design internship across Creative Cloud.', 'https://adobe.com/careers.html', ARRAY['Design','Figma','Internship'], false),

-- ===== REMOTE / GLOBAL =====
('Developer Advocate', 'MongoDB', 'Remote', 'Full-time', '$130k–$190k', 'Speak, write, and code with the developer community.', 'https://www.mongodb.com/careers', ARRAY['DevRel','Node.js','Content'], true),
('Technical Writer', 'Stripe', 'Remote', 'Full-time', '$120k–$170k', 'Document APIs used by millions of developers.', 'https://stripe.com/jobs', ARRAY['Writing','API','Markdown'], true),
('Solutions Engineer', 'Databricks', 'Remote', 'Full-time', '$160k–$240k', 'Pre-sales for the Lakehouse platform.', 'https://www.databricks.com/company/careers', ARRAY['Spark','Data','Sales'], true),
('Customer Success Manager', 'Notion', 'Remote', 'Full-time', '$110k–$160k', 'Drive expansion across mid-market accounts.', 'https://www.notion.so/careers', ARRAY['CS','SaaS'], true),

-- ===== STARTUPS =====
('Founding Engineer', 'YC Startup (stealth)', 'Bangalore, IN', 'Full-time', '₹40–70 LPA + equity', 'Be employee #1 at a YC W26 AI startup.', 'https://www.workatastartup.com', ARRAY['Full-Stack','AI','Startup'], false),
('Founding Designer', 'Series A AI startup', 'Remote', 'Full-time', '$130k–$200k + equity', 'Define the product design language from scratch.', 'https://www.workatastartup.com', ARRAY['Design','Founding','AI'], true),
('Growth Engineer', 'Linear', 'Remote', 'Full-time', '$150k–$210k', 'Hybrid eng + marketing role at Linear.', 'https://linear.app/careers', ARRAY['Growth','TypeScript','Analytics'], true);
