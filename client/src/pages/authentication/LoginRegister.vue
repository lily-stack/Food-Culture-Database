<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div class="bg-white shadow-lg rounded-lg border border-gray-200 p-8 max-w-md w-full">
            <div class="flex items-center justify-center mb-6">
                <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/WorldFoodIcon.ico" alt="Recipe icon"
                        class="w-full h-full object-cover object-center scale-125" />
                </div>
            </div>

            <div class="flex gap-2 mb-6">
                <button @click="mode = 'login'" :class="[
                    'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                    mode === 'login'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]">
                    Login
                </button>
                <button @click="mode = 'register'" :class="[
                    'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                    mode === 'register'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]">
                    Sign Up
                </button>
            </div>

            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6 font-[Merriweather]">
                {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
            </h2>

            <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label for="login-email" class="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input id="login-email" v-model="loginEmail" type="email" placeholder="Enter your email" required
                        :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                </div>

                <div>
                    <label for="login-password" class="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input id="login-password" v-model="loginPassword" type="password" placeholder="Enter your password"
                        required :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>

                <p v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                    {{ error }}
                </p>
            </form>

            <form v-else-if="mode === 'register' && !showConfirmation" @submit.prevent="handleRegister"
                class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="first-name" class="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                        </label>
                        <input id="first-name" v-model="firstName" type="text" placeholder="First name" required
                            :disabled="loading"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                    </div>
                    <div>
                        <label for="last-name" class="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input id="last-name" v-model="lastName" type="text" placeholder="Last name" required
                            :disabled="loading"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                    </div>
                </div>

                <div>
                    <label for="register-email" class="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                    </label>
                    <input id="register-email" v-model="registerEmail" type="email" placeholder="Enter your email"
                        required :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                </div>

                <div>
                    <label for="register-password" class="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <input id="register-password" v-model="registerPassword" type="password"
                        placeholder="Enter your password" required :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                    <p class="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                </div>

                <div>
                    <label for="confirm-password" class="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input id="confirm-password" v-model="confirmPassword" type="password"
                        placeholder="Confirm your password" required :disabled="loading"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md">
                    {{ loading ? 'Creating Account...' : 'Sign Up' }}
                </button>

                <p v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                    {{ error }}
                </p>
            </form>

            <form v-else-if="showConfirmation" @submit.prevent="handleConfirmation" class="space-y-4">
                <div class="bg-indigo-50 p-4 rounded-lg text-center mb-4">
                    <p class="text-sm text-gray-700 mb-1">
                        We've sent a verification code to:
                    </p>
                    <p class="font-semibold text-gray-900">{{ registerEmail }}</p>
                </div>

                <div>
                    <label for="code" class="block text-sm font-semibold text-gray-700 mb-2">
                        Verification Code
                    </label>
                    <input id="code" v-model="confirmationCode" type="text" placeholder="Enter 6-digit code" required
                        :disabled="loading" maxlength="6"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-center text-2xl tracking-widest" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md">
                    {{ loading ? 'Verifying...' : 'Verify Email' }}
                </button>

                <button type="button" @click="handleResendCode" :disabled="loading"
                    class="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors">
                    Resend Code
                </button>

                <button type="button" @click="backToRegister" :disabled="loading"
                    class="w-full text-gray-600 font-semibold py-2 hover:text-gray-800 transition-colors">
                    ← Back to Sign Up
                </button>

                <p v-if="error" class="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                    {{ error }}
                </p>

                <p v-if="successMessage" class="text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center">
                    {{ successMessage }}
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const authStore = useAuthStore();

    const mode = ref<'login' | 'register'>('login');

    const loginEmail = ref<string>('');
    const loginPassword = ref<string>('');

    const firstName = ref<string>('');
    const lastName = ref<string>('');
    const registerEmail = ref<string>('');
    const registerPassword = ref<string>('');
    const confirmPassword = ref<string>('');
    const confirmationCode = ref<string>('');

    const error = ref<string>('');
    const successMessage = ref<string>('');
    const loading = ref<boolean>(false);
    const showConfirmation = ref<boolean>(false);

    const handleLogin = async (): Promise<void> => {
        error.value = '';
        loading.value = true;

        try {
            await authStore.login(loginEmail.value, loginPassword.value);

            router.push('/');
        } catch (err: any) {
            console.error('Error signing in:', err);
            error.value = err.message || 'Failed to login';
        } finally {
            loading.value = false;
        }
    };

    const handleRegister = async (): Promise<void> => {
        error.value = '';

        if (registerPassword.value !== confirmPassword.value) {
            error.value = 'Passwords do not match';
            return;
        }

        const password = registerPassword.value;

        if (password.length < 8) {
            error.value = 'Password must be at least 8 characters';
            return;
        }

        if (!/[A-Z]/.test(password)) {
            error.value = 'Password must contain at least 1 uppercase letter';
            return;
        }

        if (!/[a-z]/.test(password)) {
            error.value = 'Password must contain at least 1 lowercase letter';
            return;
        }

        if (!/[0-9]/.test(password)) {
            error.value = 'Password must contain at least 1 number';
            return;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            error.value = 'Password must contain at least 1 special character';
            return;
        }

        loading.value = true;

        try {
            await authStore.register(
                registerEmail.value,
                registerPassword.value,
                firstName.value,
                lastName.value
            );

            showConfirmation.value = true;
            successMessage.value = 'Account created! Please check your email for verification code.';
        } catch (err: any) {
            console.error('Error signing up:', err);
            error.value = err.message || 'Failed to create account';
        } finally {
            loading.value = false;
        }
    };

    const handleConfirmation = async (): Promise<void> => {
        error.value = '';
        successMessage.value = '';
        loading.value = true;

        try {
            await authStore.confirmRegistration(registerEmail.value, confirmationCode.value);

            successMessage.value = 'Email verified! You can now login.';
            setTimeout(() => {
                showConfirmation.value = false;
                mode.value = 'login';
                loginEmail.value = registerEmail.value;
            }, 2000);
        } catch (err: any) {
            console.error('Error confirming sign up:', err);
            error.value = err.message || 'Failed to verify code';
        } finally {
            loading.value = false;
        }
    };

    const handleResendCode = async (): Promise<void> => {
        error.value = '';
        successMessage.value = '';
        loading.value = true;

        try {
            await authStore.resendCode(registerEmail.value);
            successMessage.value = 'Verification code resent!';
        } catch (err: any) {
            console.error('Error resending code:', err);
            error.value = err.message || 'Failed to resend code';
        } finally {
            loading.value = false;
        }
    };

    const backToRegister = (): void => {
        showConfirmation.value = false;
        error.value = '';
        successMessage.value = '';
        confirmationCode.value = '';
    };
</script>