import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
    signUp,
    signIn,
    signOut,
    confirmSignUp,
    resendSignUpCode,
    getCurrentUser,
    fetchUserAttributes,
    fetchAuthSession
} from 'aws-amplify/auth';

interface UserAttributes {
    email: string;
    given_name?: string;
    family_name?: string;
    sub?: string;
}

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref<boolean>(false);
    const currentUser = ref<any>(null);
    const userAttributes = ref<UserAttributes | null>(null);
    const isCheckingAuth = ref<boolean>(true);

    const fullName = computed(() => {
        if (!userAttributes.value) {
            return null;
        }
        const firstName = userAttributes.value.given_name || '';
        const lastName = userAttributes.value.family_name || '';
        return `${firstName} ${lastName}`.trim() || null;
    });

    const firstName = computed(() => userAttributes.value?.given_name || null);
    const lastName = computed(() => userAttributes.value?.family_name || null);
    const email = computed(() => userAttributes.value?.email || null);

    async function register(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) {
        try {
            const { userId } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        given_name: firstName,
                        family_name: lastName
                    }
                }
            });
            return { success: true, userId };
        } catch (error: any) {
            console.error('Error signing up:', error);
            throw error;
        }
    }

    async function confirmRegistration(email: string, code: string) {
        try {
            await confirmSignUp({
                username: email,
                confirmationCode: code
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error confirming sign up:', error);
            throw error;
        }
    }

    async function login(email: string, password: string) {
        try {
            const { isSignedIn } = await signIn({
                username: email,
                password
            });

            if (isSignedIn) {
                await checkAuthStatus();
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    async function logout() {
        try {
            await signOut();
            isAuthenticated.value = false;
            currentUser.value = null;
            userAttributes.value = null;
        } catch (error: any) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    async function checkAuthStatus(): Promise<boolean> {
        isCheckingAuth.value = true;
        try {
            const user = await getCurrentUser();
            currentUser.value = user;

            const attributes = await fetchUserAttributes();
            userAttributes.value = attributes as UserAttributes;

            isAuthenticated.value = true;
            return true;
        } catch (error) {
            isAuthenticated.value = false;
            currentUser.value = null;
            userAttributes.value = null;
            return false;
        } finally {
            isCheckingAuth.value = false;
        }
    }

    async function getAccessToken(): Promise<string | null> {
        try {
            const session = await fetchAuthSession();
            return session.tokens?.accessToken?.toString() || null;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    }

    async function resendCode(email: string) {
        try {
            await resendSignUpCode({
                username: email
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error resending code:', error);
            throw error;
        }
    }

    return {
        isAuthenticated,
        currentUser,
        userAttributes,
        isCheckingAuth,

        fullName,
        firstName,
        lastName,
        email,

        register,
        confirmRegistration,
        login,
        logout,
        checkAuthStatus,
        getAccessToken,
        resendCode
    };
});