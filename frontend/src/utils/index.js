import axios from "axios";
import { useUserStore } from "@/stores/user";

function getApi() {
    const userStore = useUserStore ()
    const api = axios.create({
        baseURL: process.env.VUE_APP_BACKEND_URL,
        headers: {
            'X-Client-Id': userStore.clientId
        }
    })

    return api
}

function isDevMode() {
    return process.env.NODE_ENV === 'development'
}

export default { getApi, isDevMode }
export { getApi, isDevMode }