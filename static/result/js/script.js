import ConstituentsTable from "./ConstituentsTable.js";

const { createApp } = Vue

createApp({
    components: {
        ConstituentsTable
    },
    data() {
        return {
            honest: "",
            constituents: []
        }
    },
    created() {
        this.fetchData(null);
    },
    methods: {
        fetchData(event) {
            let honest = this.honest;
            if (event) {
                honest = event.target.value;
            }
            let url = '/vote/result';
            if (honest !== "") {
                url = url + `?honest=${honest}`
            }
            console.log(url)
            this.constituents = [];
            fetch(url)
                .then((response) => response.json())
                .then((data) => this.constituents.push(...data));
        },
    },
    computed: {
        isVotingEnded() {
            return new Date() >= new Date("2022-10-18T13:30Z");
        }
    },
    template: `
    <div class="row" v-if="isVotingEnded">
        <fieldset style="width: 100%">
            <legend>Honesty filter</legend>
            <label for="honestyInput" class="form-label">Honesty</label>
            <select id="honestyInput" v-model.lazy="honest" @input="fetchData">
                <option value="" selected>Don't care</option>
                <option value="false">False</option>
                <option value="true">True</option>
            </select>
        </fieldset>
    </div>

    <div class="row">
        <constituents-table v-if="isVotingEnded" :constituents="constituents" />
        <h1 v-if="!isVotingEnded">Voting has not ended yet! Comeback after 1:30 pm.</h1>
    </div>
    `
}).mount('#app')
