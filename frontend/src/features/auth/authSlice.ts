import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { createUserWithEmailAndPasswordAPI, getUserDataAPI, resetPasswordAPI, signInWithEmailAndPasswordAPI, signOutAPI } from './authAPI';

const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
};

const deleteCookie = (name: string) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

export interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    emailVerified: boolean;
}

export interface AuthState {
    token: string;
    user: UserData | null;
    loading: boolean;
}

const initialState: AuthState = {
    token: '',
    user: null,
    loading: true,
};


export const createUser = createAsyncThunk(
    'auth/createUser',
    async ({ email, password, name }: { email: string; password: string; name: string }) => {
        const user = await createUserWithEmailAndPasswordAPI(email, password, name);
        if (!user) {
            throw new Error('Failed to create user');
        }
        
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
        } as UserData;
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const user = await signInWithEmailAndPasswordAPI(email, password);
        if (!user) {
            throw new Error('Failed to login');
        }
        const token = await user.getIdToken();
        setCookie('accessToken', token);

        const userData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
        };
        return { user: userData, token };
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        const success = await signOutAPI();
        if (!success) {
            throw new Error('Failed to logout');
        }
        deleteCookie('accessToken');
        return true;
    }
);

export const getUserData = createAsyncThunk(
    'auth/getUserData',
    async () => {
        const user = await getUserDataAPI();
        if (!user) {
            return { user: null, token: '' };
        }
        const token = await user.getIdToken();
        setCookie('accessToken', token);
        
        const userData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
        };
        return { user: userData, token };
    }
);

export const toggleLoading = createAsyncThunk(
    'auth/toggleLoading',
    async (loading: boolean) => {
        return loading;
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (email: string) => {
        const success = await resetPasswordAPI(email);
        if (!success) {
            throw new Error('Failed to reset password');
        }
        return true;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = '';
            state.user = null;
        },
        setUser: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.token = '';
                state.user = null;
            })
            .addCase(logout.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                } else {
                    state.user = null;
                    state.token = '';
                    deleteCookie('accessToken');
                }
            })
            .addCase(getUserData.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = '';
                deleteCookie('accessToken');
            })
            .addCase(toggleLoading.pending, (state) => {
                state.loading = false;
            })
            .addCase(toggleLoading.fulfilled, (state, action) => {
                state.loading = action.payload;
            })
            .addCase(toggleLoading.rejected, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setToken, clearToken, setUser, clearUser } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => {
    return state.auth.token !== '';
};

export const selectToken = (state: RootState) => {
    return state.auth.token;
};

export const selectLoading = (state: RootState) => {
    return state.auth.loading;
};

export const selectUser = (state: RootState) => {
    return state.auth.user;
};

export default authSlice.reducer;

