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
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsFocused: (state, action) => {
      state.isFocused = action.payload;
    },
    setTypingStatus: (state, action) => {
      state.typingStatus = action.payload;
    },
    setMessageContent: (state, action) => {
      state.messageContent = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
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
  setMessageContent,
  setMessages,
  setReceiverData,
  setConversations,
  setModeType,
  setSelectedPeopleToCreateGroup,
  setIsFocused,
  setTypingStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
