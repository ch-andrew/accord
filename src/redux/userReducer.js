import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUserInfo, handleFriendRequest, removeFriend, sendFriendRequest, updateUserProfile } from "../fb"

const initialState = {
    username: '',
    displayName: '',
    email: '',
    friends: [],
    friendRequests: [],
    blocked: [],
    info: '',
    loading: false
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

export const updateProfileRequest = createAsyncThunk(
    'user/updateProfile',
    async ({username, query, data}) => {
        const response = await updateUserProfile(username, query, data)
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
                state.username = action.payload.username
                state.displayName = action.payload.displayName
                state.email = action.payload.email
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
                state.about = action.payload.about
                state.status = action.payload.status
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
            .addCase(updateProfileRequest.pending, (state) => {
                state.loading = true
            })
            .addCase(updateProfileRequest.fulfilled, (state, action) => {
                state.username = action.payload.username
                state.displayName = action.payload.displayName
                state.email = action.payload.email
                state.friends = action.payload.friends
                state.friendRequests = action.payload.friendRequests
                state.about = action.payload.about
                state.status = action.payload.status
            })
    }
})

export const { resetUsers } = userSlice.actions
export default userSlice.reducer