import ConstituentsTable from "./ConstituentsTable.js";

const { createApp } = Vue

createApp({
    components: {
        ConstituentsTable
    },
    data() {
        return {
            constituents: []
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            fetch('/vote/result')
                .then((response) => response.json())
                .then((data) => this.constituents.push(...data));
        },
    },
    template: `
        <constituents-table :constituents="constituents" />
    `
}).mount('#app')
