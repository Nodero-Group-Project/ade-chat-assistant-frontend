# Nodero 
**Natural-language interface for Aotearoa Data Explorer (ADE)**
- The app lets users ask ADE data questions such as *"How many people smoke in 2023?"* in natural language rather than manually navigating table lists, filters, and classification schemes. 

<img width="1892" height="966" alt="image" src="https://github.com/user-attachments/assets/b19f2b95-6046-42b5-aa52-05c541a99eab" />

## Tech stack

- React + Typescript
- Tailwind CSS
- MUI X (chatbox interface and data results table)

## Prerequisites

- Node.js 20+
- npm
- The backend running locally (see [Backend Setup](#backend-setup))

## Getting started
```bash
git clone <repo-url>
cd <repo>
npm install
```
Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```
Start the dev server:

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Backend Setup
The frontend requires the backend API. From the backend folder (requires [uv](https://docs.astral.sh/uv/)):

```bash
uv run fastapi dev
```
Backend repo: `<https://github.com/Nodero-Group-Project/ade-chat-assistant-backend.git>`

## Project structure
```
src/
├── components/
│   ├── Dataset        # Dataset page
│   ├── Intent         # Intent page
│   ├── MuiTable       # Renders data results in a table
│   ├── RenderChat     # Chatbox interface
│   └── TokenUsage     # Token consumption per user query
├── adapter.tsx        # Backend connection
└── adapter.test.tsx   # Tests for the backend connection
```

