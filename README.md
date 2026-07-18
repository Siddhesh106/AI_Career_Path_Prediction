 🚀 AI Career Path Prediction
![image alt](https://github.com/Siddhesh106/AI_Career_Path_Prediction/blob/878a930c028a0f3822f4530f1b7f34f6f401d726/image%201.jpeg)
> An AI-powered career recommendation platform that predicts the most suitable Artificial Intelligence career path based on a user's skills, education, interests, certifications, and experience. The platform also provides personalized learning roadmaps, skill gap analysis, and career guidance to help users achieve their professional goals.

---

## 📌 Table of Contents

- About the Project
- Problem Statement
- Solution
- Key Features
- Technology Stack
- Project Workflow
- Machine Learning Pipeline
- Folder Structure
- Installation
- Running the Project
- Environment Variables
- Screenshots
- Future Improvements
- What I Learned
- Contributing
- License
- Author

---

# 📖 About the Project

Choosing the right career in Artificial Intelligence can be challenging due to the wide range of specializations available, such as Machine Learning, Data Science, NLP, Computer Vision, MLOps, and AI Research.

This project uses Machine Learning to analyze a user's profile—including technical skills, education, certifications, projects, interests, and experience—to predict the most suitable AI career path. It also recommends learning resources, identifies missing skills, and provides a personalized roadmap for career growth.

---

# ❗ Problem Statement

Many students and professionals want to build a career in AI but struggle to answer questions like:

- Which AI field is best for me?
- Which skills am I missing?
- What should I learn next?
- Which certifications are most valuable?
- Which projects should I build?
- Which jobs match my profile?

Most existing career recommendation platforms provide generic suggestions rather than personalized guidance.

---

# 💡 Solution

This project combines Machine Learning with career recommendation techniques to generate personalized AI career predictions.

Based on user input, the system:

- Predicts the most suitable AI career
- Identifies missing skills
- Suggests learning resources
- Recommends certifications
- Generates a learning roadmap
- Provides job recommendations

---

# ✨ Features

- 🤖 AI Career Prediction
- 📊 Skill Gap Analysis
- 📚 Personalized Learning Roadmap
- 💼 Job Recommendation
- 🎓 Certification Suggestions
- 🧠 Machine Learning Based Prediction
- 🔍 User Skill Analysis
- 📈 Career Growth Recommendations
- 🔐 Secure User Authentication
- 🌐 Modern Web Interface
- 📱 Responsive Design

---

# 🛠 Technology Stack

## Frontend

- Next.js
- React
- Tailwind CSS

## Backend

- FastAPI
- Python

## Machine Learning

- Scikit-Learn
- Random Forest
- XGBoost
- PCA
- LDA

## Database

- Supabase

## Authentication

- Supabase Auth

## Data Visualization

- Matplotlib
- Pandas
- NumPy

---

# 🔄 Project Workflow

```text
User Registration
        │
        ▼
Login Authentication
        │
        ▼
Profile & Skill Assessment
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Machine Learning Prediction
        │
        ▼
Career Recommendation
        │
        ▼
Skill Gap Analysis
        │
        ▼
Learning Roadmap
        │
        ▼
Job Recommendations
```

---

# 🧠 Machine Learning Pipeline

```text
Dataset Collection
        │
        ▼
Data Cleaning
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Feature Selection
        │
        ▼
Train/Test Split
        │
        ▼
Model Training
        │
        ▼
Hyperparameter Tuning
        │
        ▼
Model Evaluation
        │
        ▼
Prediction API
```

---

# 📂 Folder Structure

```text
AI-Career-Path-Prediction/

├── app/
│   ├── frontend/
│   └── backend/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── models/
│
├── notebooks/
│
├── src/
│
├── docs/
│
├── screenshots/
│
├── requirements.txt
├── README.md
└── .env.example
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/your-username/AI-Career-Path-Prediction.git
```

```bash
cd AI-Career-Path-Prediction
```

---

## Create a Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

# ▶ Running the Project

## Start Backend

```bash
uvicorn main:app --reload
```

Backend:

```
http://localhost:8000
```

---

## Start Frontend

```bash
npm run dev
```

Frontend:

```
http://localhost:3000
```


# 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
SUPABASE_URL=your_supabase_url

SUPABASE_KEY=your_supabase_key

DATABASE_URL=your_database_url

OPENAI_API_KEY=your_api_key


# 📊 Machine Learning Models

The project currently supports:

- Random Forest
- XGBoost
- PCA
- LDA
- GridSearchCV
- Cross Validation


 📈 Evaluation Metrics

Model performance is evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- MAE
- RMSE
- R² Score


 📸 Screenshots




## screenshots/

Home Page

Dashboard

Prediction Page

Career Result

Learning Roadmap

Job Recommendation
```

---

# 🚀 Future Improvements

- Resume Analyzer
- ATS Resume Checker
- AI Interview Assistant
- LLM Career Mentor
- Salary Prediction
- Live Job API Integration
- Company Recommendation
- Industry Trend Prediction
- Personalized AI Chatbot

---

# 📚 What I Learned

Developing this project provided hands-on experience in multiple areas of software engineering and machine learning.

### Machine Learning

- Data preprocessing and cleaning
- Feature engineering
- Feature selection
- Model training and evaluation
- Hyperparameter tuning
- Model comparison

### Backend Development

- REST API development using FastAPI
- Authentication
- API integration
- Model deployment

### Frontend Development

- Building responsive interfaces with Next.js
- State management
- Form validation
- API communication

### Database

- Supabase integration
- User authentication
- Data storage
- Database management

### Software Engineering

- Project architecture
- Git & GitHub workflow
- Documentation
- Environment management
- Error handling
- Debugging
- Version control

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Siddhesh Mhatre**

AI & Machine Learning Enthusiast

- LinkedIn: *(Add your profile)*
- GitHub: *(Add your GitHub profile)*

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub. It helps others discover the project and motivates future improvements.

---
