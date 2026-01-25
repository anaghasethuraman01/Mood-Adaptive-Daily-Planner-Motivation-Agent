# 🧠 Mood-Adaptive Daily Planner & Motivation Agent
 
 ## 📌  **Problem Statement** 
People often feel overwhelmed, low-energy, or unmotivated and waste time deciding what to do each day. This leads to stress, low productivity, and missed self-care. Solving this is important because a small daily boost through personalized motivation, structured planning, and short well-being activities can improve mood, productivity, and overall mental wellness. 


## 🎯 **Goal**
#### Architecture
<img width="566" height="807" alt="Screenshot 2025-11-29 at 11 42 13 PM" src="https://github.com/user-attachments/assets/08ad80d1-3172-4722-a7ec-be1c2544ce3c" />

## ⭐ **Demo** 

#### Watch on Youtube :  [Adaptive AI Taks Planner Demo](https://youtu.be/fbmRgIPS3Mo)
#### Example Input
```
Mood: lazy
Energy level (1-5): 2
Time available: 60 minutes
Goals: work, car wash

```


#### Example Output
```
{
 "motivation_message": "It's okay to be lazy and low-energy. Let's focus on making just one thing happen today, keeping it super simple and low-effort.",
 "daily_plan": [
   {
     "task": "Engage in a very brief, essential work task",
     "duration_min": 25,
     "priority": 1
   },
   {
     "task": "Quick exterior car wash (or skip if too much)",
     "duration_min": 20,
     "priority": 2
   }
 ],
 "micro_activity": "Spend 5 minutes doing some very gentle, seated stretches."
}

```


## 🛠️ **The Build** 
#### 🔧 Languages/Tools: 
-  Python
-  Google AI Agent Developer Kit (ADK)
-  Gemini 2.5 Flash / Gemini Flash Lite
-  Kaggle Notebooks
-  JSON for structured outputs

#### 🧠 Core components:

#### The core functionality is built using the Google AI ADK, which provides:
-  Agent orchestration
-  Ability to define instructions + tools
-  Built-in agent runtime + ADK web UI

#### 🧩 The agent receives:
-  Mood (e.g., “stressed”, “worried”, “motivated”)
-  Energy level (1–5)
-  Available time
-  Optional goals (work, cooking, studying, self-care…)

#### ⚙️ The agent uses a prompt template defining rules:
-  Produce a short motivational message
-  Create a time-bounded daily plan
-  Assign priorities
-  Add a micro-activity (1–5 min)
-  Return strict JSON only

-  Prompt template for LLM / mock agent

-  JSON output with structured daily plan and micro-activity



### 🚀 Future Scope

 If I had additional time to extend and enhance this project, I would focus on the following key improvements to increase real-world usefulness, accuracy, personalization, and production readiness:

#### 1. Build a More Realistic Emotion-Aware Model

-  Train or fine-tune a lightweight classifier that predicts user emotions from text inputs instead of relying only on manual mood selection.
-  Integrate sentiment tracking over time to see trends in mood, stress, and productivity.

#### 2. Add Tool Use (Search, Calendar, Tasks) Using the ADK

 Extend the agent so it can use tools such as:
 - Google Search (for breaking down goals or suggesting resources)
 - Google Calendar API (to place tasks directly into the user’s schedule)
 - Google Tasks API (to update or create a to-do list)

 This would turn the project from a planner assistant into an actual task-automation agent.

#### 3. Build a Full Front-End UI

-  Create an interactive web UI using the ADK Web Interface or React.
-   Add emojis for mood and real-time previews of the daily plan.

#### 4. User Profiles & Personalization

-  Save user preferences (e.g., productivity style, morning/evening energy peaks, task types).
-  Track daily history to adapt task duration estimates and priorities personalized to the user.

#### 5. Production-Grade Deployment

 - Turn the notebook prototype into a deployable agent:

 - Containerize using Docker

 - Host on Google Cloud Run

 - Add a minimal backend API endpoint

 - Build a polished UI accessible via web or mobile.

### 📜 **License**

This project is licensed under the MIT License.

Note: You are free to use, share, and adapt this project with proper credit. Please do not rebrand, resell, or redistribute modified versions without clear attribution to the original author.

© 2025 Anagha Sethuraman. All rights reserved.





