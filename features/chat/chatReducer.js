import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messageContent: '',
  messages: [],
  receiverData: {},
  conversations: [],
  isGroupModeSelected: 'notGroup',
  selectedPeopleToCreateGroup: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
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
    setIsGroupModeSelected: (state, action) => {
      state.isGroupModeSelected = action.payload;
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
  setIsGroupModeSelected,
  setSelectedPeopleToCreateGroup,
} = chatSlice.actions;

export default chatSlice.reducer;
