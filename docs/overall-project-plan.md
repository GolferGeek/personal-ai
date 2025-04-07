# Overall Project Plan: Personal AI

This document outlines the high-level plan and phased approach for building the Personal AI application.

## Vision

To create a highly personalized AI assistant accessible via multiple interfaces (initially web, potentially mobile), capable of understanding natural language requests, leveraging a growing set of internal agents and external MCP servers, and utilizing long-term memory (conversation history and extracted user facts) for context and personalization. The system should be extensible and integrate with external knowledge sources like Obsidian notes.

## High-Level Phases

### Phase 1: Foundational Core (V1)

*   **Goal:** Establish the core architecture and end-to-end interaction flow. Demonstrate the ability to receive voice input, orchestrate a simple task using either an internal agent or an external MCP server (simulated via an internal API), and display results, including handling requests for more parameters via dynamic UI.
*   **Key Components:**
    *   Next.js Web Application (Basic UI, Voice Input)
    *   Backend API Layer (Orchestrator Endpoint, Dynamic Agent API Gateway)
    *   Orchestrator Agent (Basic NLU, Task Routing)
    *   Agent Registry & Dynamic Discovery
    *   Simple Internal AI Agent Implementation (e.g., String Manipulation)
    *   Simple MCP Server (Internal API Route) & Client Logic (using defined protocol)
    *   Metadata Standard (for Agents, including UI hints)
    *   Dynamic UI Component Rendering (based on Orchestrator response)
    *   Basic Frontend State Management (for conversation flow)
    *   Clear Error Handling & Display

### Phase 2: Memory & Personalization

*   **Goal:** Implement long-term memory and basic personalization features.
*   **Key Components:**
    *   Database Integration (e.g., Supabase/Postgres or MongoDB Atlas)
    *   User Authentication & Profiles
    *   Conversation History Storage & Retrieval
    *   User Fact Storage (Structured data about the user)
    *   Basic Fact Extraction Agent/Process (Identify facts from conversations)
    *   RAG Pipeline (V1): Incorporate conversation history and basic user facts into LLM prompts for context.
    *   Mechanism for User to View/Manage Basic Facts (Simple UI)

### Phase 3: Enhanced Capabilities & Integrations

*   **Goal:** Expand the AI's capabilities through more complex agents, external integrations, and improved RAG.
*   **Key Components:**
    *   Integration with External Knowledge (Obsidian Notes RAG)
    *   More Sophisticated Agents (e.g., Calendar, Email, Web Search)
    *   Advanced Orchestration (Multi-agent workflows)
    *   Improved NLU for more complex requests and parameter extraction.
    *   Refined Fact Extraction and Linking
    *   Proactive Assistance Capabilities (Initial Experiments)

### Phase 4: Multi-Modal & Cross-Platform

*   **Goal:** Expand accessibility and interaction modalities.
*   **Key Components:**
    *   Mobile Application Client (iOS/Android)
    *   Cross-Device Conversation Continuity
    *   Potential for Image/Audio Input/Output Processing (if desired)
    *   API Refinements for Public/Partner Use (if desired)

### Phase 5: Continuous Improvement & Refinement

*   **Goal:** Ongoing optimization, adding new features based on usage, improving performance, security, and user experience.
*   **Key Components:**
    *   Monitoring & Analytics
    *   User Feedback Mechanisms
    *   Performance Tuning
    *   Security Enhancements
    *   Adding new Agents/MCPs/Integrations as needed.
