<template>
    <div class="container d-flex flex-column pt-5">
        <div class="border border-3 border-primary rounded-3 bg-secondary shadow mb-5">
            <h1 class="text-primary text-center">Weather Descriptor</h1>
        </div>
        <div class="border border-3 border-primary rounded-3 bg-secondary shadow mb-4">
            <form @submit="checkStatus" onsubmit="return false" class="m-4">
                <div class="mb-4">
                    <label class="form-label">Select the country: </label>
                    <select class="form-select border border-3 border-primary" ref="code">
                        <option :value="i" v-for="{ name }, i in countries" :key="name">{{ name }}</option>
                    </select>
                </div>
                <div class="mb-4">
                    <button type="submit">Submit</button>
                    <p v-if="loading" class="msg-loading">Please wait....</p>
                    <p v-else-if="errorMessage" class="msg-error">{{ errorMessage }}</p>
                    <p v-else-if="success" class="msg-success">Successfully</p>
                </div>
            </form>
        </div>
        <div class="border border-3 border-primary rounded-3 bg-secondary shadow p-3"> 
            <h4>Result:</h4>
            <div class="mt-3">
                <p><span class="fw-semibold">Country Name: </span>{{ countryName }}</p>
                <p><span class="fw-semibold">Country Code: </span>{{ countryCode }}</p>
                <p><span class="fw-semibold">Description: </span>{{ description }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import { getApi } from '@/utils'

export default {
    name: 'App',
    data() {
        return {
            loading: false,
            errorMessage: '',
            success: false,
            countries: require('@/assets/countries.json'),
            countryName: '',
            countryCode: '',
            description: ''
        }
    },
    methods: {
        startLoading() {
            this.loading = true
        },
        cancelLoading(error, response) {
            this.loading = false

            if (error) {
                this.errorMessage = 'Something went wrong with server.'
                this.success = false
            } else {
                this.errorMessage = ''
                this.success = true
                return
            }

            if (response && response.status === 429) {
                this.errorMessage = `Try again after ${response.headers['retry-after']} seconds`
            }
        },
        async checkStatus(e) {
            e.preventDefault()
            this.startLoading()

            try {
                const selectedCountry = this.countries[this.$refs.code.value]

                const response = await getApi().get(`/${selectedCountry.code}`)
                this.$log.debug(response.data)
                if (!response.data.description) throw new Error('Data is not valid')

                this.countryName = selectedCountry.name
                this.countryCode = selectedCountry.code
                this.description = response.data.description

                this.cancelLoading(false)
            } catch (error) {
                this.$log.error(error)
                this.cancelLoading(true, error.response)
            }

        }
    }
}
</script>

<style scoped>
button[type="submit"] {
    border: 3px rgb(var(--primary-rgb)) solid;
    border-radius: 7px;
    padding: 5px 15px;
}

button[type="submit"]:hover {
    box-shadow: 0 0 10px rgb(var(--primary-rgb));
}

.msg-success {
    color: limegreen !important;
}

.msg-loading {
    color: rgb(0, 60, 226) !important;
}

.msg-error {
    color: red !important;
}

.msg-success,
.msg-loading,
.msg-error {
    margin: 0px;
    margin-top: 10px;
}

.shadow {
    box-shadow: 0px 0px 20px lightgray !important;
}

p {
    margin-bottom: 5px;
}

body {
    margin: 0;
}
</style>
  