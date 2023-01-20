import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUserInfo, handleFriendRequest, removeFriend, sendFriendRequest } from "../fb"

const initialState = {
    username: '',
    friends: [],
    friendRequests: [],
    blocked: [],
    info: ''
}

export const requestUserInfo = createAsyncThunk(
    'user/requestUserInfo',
    async (authID) => {
        const response = await getUserInfo(authID)
        return response
    }
)

export const requestAddFriend = createAsyncThunk(
    'user/requestAddFriend',
    async ({from , username}) => {
        const response = await sendFriendRequest(from, username)
        return response
    }
)

export const requestRemoveFriend = createAsyncThunk(
    'user/requestRemoveFriend',
    async ({from , username}) => {
        const response = await removeFriend(from, username)
        return response
    }
)

export const acceptFriendRequest = createAsyncThunk(
    'user/acceptFriend',
    async ({from, username}) => {
        console.log(from, username);
        const response = await handleFriendRequest('accept', from, username)
        return response
    }
)

export const declineFriendRequest = createAsyncThunk(
    'user/removeFriend',
    async ({from, username}) => {
        const response = await handleFriendRequest('decline', from, username)
        return response
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUsers: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestUserInfo.pending, (state) => {
                state.username = ''
            })
            .addCase(requestUserInfo.fulfilled, (state, action) => {
                console.log(action.payload);
                state.username = action.payload.username
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
            })
            .addCase(requestAddFriend.pending, (state) => {
                state.info = ''
            })
            .addCase(requestAddFriend.fulfilled, (state, action) => {
                state.info = action.payload
            })
            .addCase(requestRemoveFriend.pending, (state) => {
                state.info = ''
            })
            .addCase(requestRemoveFriend.fulfilled, (state, action) => {
                state.info = 'Friend removed'
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
            })
            .addCase(acceptFriendRequest.pending, (state) => {
                state.info = ''
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.info = 'Friend request accepted'
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
            })
            .addCase(declineFriendRequest.pending, (state) => {
                state.info = ''
            })
            .addCase(declineFriendRequest.fulfilled, (state, action) => {
                state.info = 'Friend request declined'
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
            })
    }
})

export const { resetUsers } = userSlice.actions
export default userSlice.reducer