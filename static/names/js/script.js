import VotersTable from "./VotersTable.js";

const { createApp } = Vue

createApp({
    components: {
        VotersTable
    },
    data() {
        return {
            voters: []
        }
    },
    created() {
        this.fetchData(null);
    },
    methods: {
        fetchData(event) {
            fetch("/voters")
                .then((response) => response.json())
                .then((data) => this.voters.push(...data));
        },
    },
    template: `
    <div class="row">
        <voters-table :voters="voters" />
    </div>
    `
}).mount('#app')
