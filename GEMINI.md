# GEMINI.md

## Project Overview

This is a web application built with Next.js and TypeScript, designed to be an AI-powered ADHD helper. The goal is to create a "dopamine-friendly" UI with real-time feedback and engaging animations to help users stay focused and on track.

The application uses a local Ollama instance to power the AI chat, and the frontend is built with shadcn/ui, Tailwind CSS, and Anime.js for animations. The Vercel AI SDK is used for streaming chat responses.

The backend is planned to be a separate FastAPI application, but the current focus is on the frontend.

## Building and Running

To build and run this project, you will need to have Bun installed.

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Run the development server:**
    ```bash
    bun run dev
    ```

3.  **Build for production:**
    ```bash
    bun run build
    ```

4.  **Run in production:**
    ```bash
    bun run start
    ```

## Development Conventions

*   **Package Manager:** This project uses Bun for package management. Do not use `npm` or `yarn`.
*   **Linting:** The project uses ESLint for code linting. You can run the linter with:
    ```bash
    bun run lint
    ```
*   **Styling:** The project uses Tailwind CSS for styling, with shadcn/ui for UI components.
*   **AI:** The AI is powered by a local Ollama instance. The available models are fetched from the `/api/models` endpoint, which in turn calls the Ollama API.
*   **Chat:** The chat interface is built with the Vercel AI SDK, and the chat state is managed in the `src/features/chat` directory.
