# AI Assistant Chat Implementation Plan

## 1. Overview

This document outlines the step-by-step plan to implement the AI Assistant Chat feature. The target audience for this document is a junior developer.

## 2. UI/UX Changes

### 2.1. Create a New Conversation with AI Assistant

We need a way for users to start a conversation with the AI assistant. We will add a new button in the `ConversationList.jsx` component.

- **File to modify**: `src/components/chat/ConversationList.jsx`
- **Action**: Add a new button with a robot icon next to the "New Chat" button.
- **Logic**: When the button is clicked, it should create a new conversation with a special user ID for the AI assistant (e.g., `AI_ASSISTANT_ID`).

### 2.2. Distinguish AI Assistant in Conversation List

The AI assistant should be easily identifiable in the conversation list.

- **File to modify**: `src/components/chat/ConversationItem.jsx`
- **Action**: Add a condition to check if the conversation is with the AI assistant.
- **Logic**: If the conversation is with the AI assistant, display a robot icon next to the name and use a different avatar.

### 2.3. Differentiate AI Messages in Chat Window

Messages from the AI assistant should look different from user messages.

- **File to modify**: `src/components/chat/Message.jsx`
- **Action**: Add a new prop `isAIMessage` to the `Message` component.
- **Logic**: If `isAIMessage` is true, apply different styling to the message bubble (e.g., a different background color).

## 3. State Management (Redux)

### 3.1. Update Chat Reducer

We need to add a new state to handle the AI conversation.

- **File to modify**: `features/chat/chatReducer.js`
- **Action**: Add a new state `isAIChat` to the `initialState`.
- **Logic**: This state will be a boolean that indicates whether the current chat is with the AI assistant.

### 3.2. Create New Actions

We need new actions to set the `isAIChat` state.

- **File to modify**: `features/chat/chatReducer.js`
- **Action**: Add a new action `setIsAIChat`.
- **Logic**: This action will take a boolean payload and update the `isAIChat` state.

## 4. Service Layer / API Integration

### 4.1. Create a New AI Service

We need a new service to handle communication with the AI API.

- **File to create**: `src/service/ai/ai.service.js`
- **Action**: Create a new class `AIService`.
- **Logic**: This class will have a method `sendToAI(message)` that sends the message to the AI API and returns the response.

### 4.2. Secure API Key

The AI API key should be stored securely.

- **File to modify**: `.env.example`
- **Action**: Add a new environment variable `VITE_AI_API_KEY`.
- **Logic**: The `AIService` will read the API key from the environment variables.

## 5. Data Flow

1.  User clicks the "AI Assistant" button in the `ConversationList`.
2.  The `createNewChat` function in `conversation.service.js` is called with the user's ID and `AI_ASSISTANT_ID`.
3.  A new conversation is created in Firestore.
4.  The user is navigated to the new chat window.
5.  The `isAIChat` state in Redux is set to `true`.
6.  The user types a message and clicks "Send".
7.  The `createNewMessage` function in `message.service.js` is called to save the user's message to Firestore.
8.  The UI is updated to show the user's message.
9.  The `sendToAI` function in `ai.service.js` is called with the user's message.
10. The AI API returns a response.
11. The `createNewMessage` function in `message.service.js` is called again to save the AI's response to Firestore. The `senderId` will be `AI_ASSISTANT_ID`.
12. The UI is updated to show the AI's message.

## 6. Firebase Integration

### 6.1. Store AI Conversations

AI conversations will be stored in the `conversations` collection in Firestore.

- **File to modify**: `src/service/firebase/conversation.service.js`
- **Action**: No changes are needed here. The existing `createNewChat` function can be used.
- **Logic**: We will use a special user ID for the AI assistant (e.g., `AI_ASSISTANT_ID`).

### 6.2. Store AI Messages

AI messages will be stored in the `messages` collection in Firestore.

- **File to modify**: `src/service/firebase/message.service.js`
- **Action**: No changes are needed here. The existing `createNewMessage` function can be used.
- **Logic**: The `senderId` for AI messages will be `AI_ASSISTANT_ID`.
