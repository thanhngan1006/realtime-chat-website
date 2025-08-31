# Plan Overview: Implement "Send Voice Message"

## Overall Strategy
This plan breaks down the implementation of the "Send Voice Message" feature into five distinct, sequential sub-tasks. The strategy is to first build the user-facing recording interface, then implement the audio capture logic, followed by handling file storage and message creation in the backend services. Finally, the plan covers rendering the voice message in the chat view. This approach ensures a logical workflow from front-end to back-end, making it manageable for a junior developer.

---

## Sub-tasks

### 1. Task 1: UI for Voice Recording Button
**Goal:** Add a microphone icon button to the chat input component to serve as the entry point for the voice recording feature.

**Requirements:**
-   **File to Modify:** `src/components/chat/MessageBox.jsx`
-   **UI:**
    -   Add a new microphone icon button next to the existing "send" or "attach" buttons in the message input area.
    -   The button should be visually distinct and intuitive. You can use an icon from a library like `react-icons`.
    -   Initially, the button's `onClick` or `onMouseDown`/`onMouseUp` handlers can be placeholders (e.g., `console.log('Recording started')`). The actual logic will be implemented in the next sub-task.
-   **State:**
    -   Introduce a state variable, e.g., `isRecording`, initialized to `false`. The button's appearance might change based on this state (e.g., color changes).

**Next Step:** The logic for capturing audio will be added in the following sub-task.

---

### 2. Task 2: Implement Voice Recording Logic
**Goal:** Implement the core logic for capturing audio using the browser's `MediaRecorder` API.

**Prerequisites:**
- The UI button from the previous task must be present in `src/components/chat/MessageBox.jsx`.

**Requirements:**
-   **File to Modify:** `src/components/chat/MessageBox.jsx`
-   **Logic:**
    -   Create functions to handle `onMouseDown` and `onMouseUp` events for the microphone button.
    -   **`onMouseDown` (Start Recording):**
        -   Request microphone access using `navigator.mediaDevices.getUserMedia({ audio: true })`.
        -   On success, create a new `MediaRecorder` instance with the received audio stream.
        -   Use a state variable (e.g., `mediaRecorderRef`) to store the instance.
        -   Start recording using `mediaRecorder.start()`.
        -   Set the `isRecording` state to `true`.
    -   **`onMouseUp` (Stop Recording):**
        -   Stop the recorder using `mediaRecorder.stop()`.
        -   The `onstop` event of the `MediaRecorder` will fire. In its handler, the recorded audio data will be available as a `Blob`.
        -   For now, you can `console.log` the blob to verify it's working. The upload logic will be handled in the next task.
        -   Set the `isRecording` state to `false`.
-   **Data Handling:**
    -   The recorded audio chunks should be collected. The final `Blob` will be created in the `onstop` event handler.

**Next Step:** The captured audio blob will be uploaded to Firebase Storage.

---

### 3. Task 3: Upload Voice Memo to Storage
**Goal:** Extend the existing file service to handle the upload of the recorded audio blob to Firebase Storage.

**Prerequisites:**
- The voice recording logic from the previous task should be able to produce an audio `Blob`.

**Requirements:**
-   **File to Modify:** `src/service/firebase/file.service.js`
-   **Logic:**
    -   Create a new function within the `fileService` singleton, e.g., `uploadVoiceMemo(audioBlob)`.
    -   This function should:
        -   Generate a unique filename for the audio file (e.g., using a timestamp or UUID).
        -   Create a Firebase Storage reference to a path like `voice-memos/{userId}/{filename}.webm`.
        -   Use the `uploadBytes` function from the Firebase Storage SDK to upload the `audioBlob`.
        -   After the upload is complete, use `getDownloadURL` to get the public URL of the uploaded file.
        -   Return the download URL.
-   **Integration:**
    -   In `src/components/chat/MessageBox.jsx`, import and use this new service function.
    -   Call `fileService.uploadVoiceMemo(audioBlob)` from within the `onstop` handler of the `MediaRecorder`.
    -   For now, `console.log` the returned URL to confirm success.

**Next Step:** The URL will be used to create a new message document in Firestore.

---

### 4. Task 4: Send Voice Message via Service
**Goal:** Modify the message service to handle sending voice messages, storing the necessary data in Firestore.

**Prerequisites:**
- The file service must be able to upload a voice memo and return a public URL.

**Requirements:**
-   **File to Modify:** `src/service/firebase/message.service.js`
-   **Logic:**
    -   The existing `sendMessage` (or equivalent) function might need to be adapted, or a new function could be created.
    -   The function should accept the conversation ID and the audio URL.
    -   It will create a new message document in the appropriate Firestore collection (`conversations/{conversationId}/messages`).
    -   **Message Payload:** The message object must be structured to differentiate voice messages from text messages. Add a `type` field.
        ```json
        {
          "senderId": "...",
          "content": "", // Empty for voice messages
          "type": "voice",
          "audioUrl": "https://firebasestorage.googleapis.com/...",
          "timestamp": "..."
        }
        ```
-   **Integration:**
    -   In `src/components/chat/MessageBox.jsx`, after successfully getting the `audioUrl` from the `fileService`, call the updated `messageService` function to send the message.

**Next Step:** The UI will be updated to display the voice message.

---

### 5. Task 5: Display Voice Message in Chat
**Goal:** Update the chat UI to properly render and play voice messages.

**Prerequisites:**
- Voice messages must be correctly stored in Firestore with `type: 'voice'` and an `audioUrl`.

**Requirements:**
-   **File to Modify:** `src/components/chat/Message.jsx`
-   **Logic:**
    -   In the `Message` component, inspect the `message` prop.
    -   Add a conditional rendering block. If `message.type === 'voice'`, render an HTML5 `<audio>` element. Otherwise, render the text content as it currently does.
    -   **Audio Player:**
        ```jsx
        {message.type === 'voice' && message.audioUrl ? (
          <audio controls src={message.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p>{message.content}</p>
        )}
        ```
-   **Styling:**
    -   Apply some basic styling to the `<audio>` element to ensure it fits nicely within the message bubble.

**Completion:** Once this task is done, the core feature of sending and receiving voice messages will be complete.