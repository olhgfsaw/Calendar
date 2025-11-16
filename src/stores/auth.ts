import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User as FirebaseUser } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'
import type { User, UserRole } from '@/types'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const firebaseUser = ref<FirebaseUser | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role || 'guest')

  const initAuth = () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        firebaseUser.value = user
        if (user) {
          await loadUserProfile(user.uid)
        } else {
          if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            currentUser.value = {
              uid: 'demo-user',
              email: 'demo@salon.com',
              displayName: 'Demo Manager',
              role: 'manager',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          } else {
            currentUser.value = null
          }
        }
        loading.value = false
        resolve()
      })
    })
  }

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        currentUser.value = {
          uid,
          ...userData,
          createdAt: userData.createdAt?.toDate(),
          updatedAt: userData.updatedAt?.toDate(),
        } as User

        const userStore = useUserStore()
        await userStore.loadSettings()
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error loading user profile:', err)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await loadUserProfile(userCredential.user.uid)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole = 'client',
  ) => {
    try {
      loading.value = true
      error.value = null

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      const userData: Partial<User> = {
        uid,
        email,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, 'users', uid), userData)
      await loadUserProfile(uid)

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      currentUser.value = null
      firebaseUser.value = null
    } catch (err: any) {
      error.value = err.message
    }
  }

  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      error.value = null
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    currentUser,
    firebaseUser,
    loading,
    error,
    isAuthenticated,
    userRole,
    initAuth,
    login,
    register,
    logout,
    resetPassword,
  }
})
