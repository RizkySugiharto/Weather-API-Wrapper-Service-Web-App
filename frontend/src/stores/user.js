import { defineStore } from "pinia"
import { v7 as uuidv7 } from "uuid"
import { getApi, isDevMode } from "@/utils"

export const useUserStore = defineStore('user', {
    state() {
        return {
            userId: '',
            username: '',
            clientId: uuidv7()
        }
    },
    actions: {
        async login(email, password) {
            try {
                const response = await getApi().post('/accounts/login', {
                    email: email,
                    password: password
                })

                if (!response.data._id) return
                this.userId = response.data._id
                this.username = response.data.username
            } catch (error) {
                if (isDevMode()) {
                    console.error(error)
                }
            }
        },
        logout() {
            this.userId = ''
            this.username = ''
        }
    },
    persist: true
})