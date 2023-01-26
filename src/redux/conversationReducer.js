import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAllConversations, sendMessage, removeMessage, addConversation } from "../fb"

const initialState = {
    conversations: [],
    currentConversation: '',
    error: '',
    loading: false
}

export const conversationListRequest = createAsyncThunk(
    'conversations/conversationListRequest',
    async (username) => {
        const response = await getAllConversations(username)
        return response
    }
)

export const addMessage = createAsyncThunk(
    'conversations/addMessage',
    async ({currentConversation, message, username, to}) => {
        console.log(currentConversation, username, to);
        if(to) {
            console.log(to);
            const response = await sendMessage(currentConversation, message, username, to)
            return response
        }

        else {
            console.log(to);
            const response = await sendMessage(currentConversation, message, username)
            return response
        }
    }
)

export const deleteMessage = createAsyncThunk(
    'conversations/deleteMessage',
    async ({currentConversation, messageID, username}) => {
        console.log(currentConversation, messageID, username);
        const response = await removeMessage(currentConversation, messageID, username)
        return response
    }
)

export const addConversationAction = createAsyncThunk(
    'conversations/addConversation',
    async ({username, recipient}) => {
        console.log(username, recipient);
        const response = await addConversation(username, recipient)
        return response
    }
)

export const conversationListSlice = createSlice({
    name: "conversations",
    initialState,
    reducers: {
        resetConversations: () => {
            console.log('reset');
            return initialState
        },
        viewConversation: (state, action) => {
            state.currentConversation = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(conversationListRequest.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(conversationListRequest.fulfilled, (state, action) => {
                state.loading = false
                state.conversations = action.payload
            })
            .addCase(addMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false
                state.conversations = action.payload
            })
            .addCase(deleteMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false
                state.conversations = action.payload
            })
            .addCase(addConversationAction.pending, (state) => {
                state.loading = true
            })
            .addCase(addConversationAction.fulfilled, (state, action) => {
                state.loading = false
                const { conversations, conversation, error} = action.payload
                if(error) state.error = error
                else {
                    state.conversations = conversations
                    state.currentConversation = conversation.id
                    state.error = null
                }
            })
    }
})

export const { resetConversations, viewConversation } = conversationListSlice.actions
export default conversationListSlice.reducer