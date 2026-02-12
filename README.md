# Tasks Generator – Mini Planning Tool

A web application that generates structured feature planning documents including user stories and engineering tasks using an LLM.

## 🚀 Features

- Input feature idea (goal, users, constraints, type)
- Generate structured user stories and engineering tasks
- Edit generated plan
- Reorder and modify tasks manually
- Save updates to database
- View last 5 generated specs
- Export plan (copy or download markdown)
- System status page (Backend, DB, LLM health)

## 🛠 Tech Stack

- Next.js 14 (App Router)
- Supabase (Database)
- OpenRouter (LLM API)
- TypeScript

## 📦 Setup Instructions

1. Clone repo
2. Install dependencies
3. Create `.env.local` from `.env.example`
4. Add:
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
5. Run locally


## 📌 What is Done

- Core generation flow
- Editable output
- Save functionality
- History tracking (last 5)
- Export support
- Status monitoring

## ⚠️ What is Not Done

- Drag-and-drop reordering (manual edit supported)
- Authentication
- Advanced role-based editing







