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
  showEmojiPicker: false,
  selectedMessageToReactEmoji: '',
  showFullEmojiPicker: false,
  emojiPickerPosition: {
    top: 0,
    left: 0,
  },
  selectedReactionDetail: '',
  isOpenMicro: false,
  recorderStatus: 'idle',
  // 'idle', 'recording', 'stopped'
  mediaBlobUrl: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsOpenMicro: (state, action) => {
      if (!action.payload) {
        state.recorderStatus = 'idle';
        state.mediaBlobUrl = null;
      }
      state.isOpenMicro = action.payload;
    },

    setRecorderStatus: (state, action) => {
      state.recorderStatus = action.payload;
    },
    setMediaBlobUrl: (state, action) => {
      state.mediaBlobUrl = action.payload;
    },
    clearRecordingState: (state) => {
      state.recorderStatus = 'idle';
      state.mediaBlobUrl = null;
    },

    setSelectedReactionDetail: (state, action) => {
      state.selectedReactionDetail = action.payload;
    },
    setEmojiPickerPosition: (state, action) => {
      state.emojiPickerPosition = action.payload;
    },
    setShowFullEmojiPicker: (state, action) => {
      state.showFullEmojiPicker = action.payload;
    },
    setShowEmojiPicker: (state, action) => {
      state.showEmojiPicker = action.payload;
    },
    setSelectedMessageToReactEmoji: (state, action) => {
      state.selectedMessageToReactEmoji = action.payload;
    },
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
  setRecorderStatus,
  setMediaBlobUrl,
  clearRecordingState,
  setSelectedReactionDetail,
  setShowFullEmojiPicker,
  setSelectedMessageToReactEmoji,
  setShowEmojiPicker,
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
  setEmojiPickerPosition,
  setIsOpenMicro,
} = chatSlice.actions;

export default chatSlice.reducer;
