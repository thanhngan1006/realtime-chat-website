import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messageContent: '',
  messages: [],
  receiverData: {},
  conversations: [],
  modeType: 'notGroup',
  selectedPeopleToCreateGroup: [],
  isFocused: false,
  typingStatus: '',
  selectedMessageId: '',
  editedMessage: '',
  updatedMessageText: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsFocused: (state, action) => {
      state.isFocused = action.payload;
    },
    setEditedMessage: (state, action) => {
      state.editedMessage = action.payload;
    },
    setUpdatedMessageText: (state, action) => {
      state.updatedMessageText = action.payload;
    },
    setSelectedMessageId: (state, action) => {
      state.selectedMessageId = action.payload;
    },
    setTypingStatus: (state, action) => {
      state.typingStatus = action.payload;
    },
    setMessageContent: (state, action) => {
      state.messageContent = action.payload;
    },
    // setMessages: (state, action) => {
    //   state.messages = action.payload;
    // },
    setMessages: (state, action) => {
      if (typeof action.payload === 'function') {
        state.messages = action.payload(state.messages);
      } else {
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      }
    },
    setReceiverData: (state, action) => {
      state.receiverData = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setModeType: (state, action) => {
      state.modeType = action.payload;
    },
    setSelectedPeopleToCreateGroup: (state, action) => {
      state.selectedPeopleToCreateGroup = action.payload;
    },
  },
});

export const {
  setEditedMessage,
  setUpdatedMessageText,
  setMessageContent,
  setMessages,
  setReceiverData,
  setConversations,
  setModeType,
  setSelectedPeopleToCreateGroup,
  setIsFocused,
  setTypingStatus,
  setSelectedMessageId,
} = chatSlice.actions;

export default chatSlice.reducer;
