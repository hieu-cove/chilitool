import ConstituentsList from './ConstituentsList.js';

const { createApp } = Vue

createApp({
    components: {
        ConstituentsList
    },
    data() {
        return {
            votername: '',
            honest: false,
            constituents: []
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            fetch('/constituents')
                .then((response) => response.json())
                .then((data) => this.constituents.push(...data));
        },
        handleSubmit() {
            const body = {
                "votername": this.votername,
                "honest": this.honest,
                "rankings": this.constituents.filter(
                    (c) => c.rank
                ).map((c) => ({
                    constituentId: c.id,
                    rank: c.rank
                }))
            };
            fetch("/vote", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then((response) => response.json()
            ).then(() => {
                this.votername = '';
                this.honest = false;
                this.constituents.length = 0;
                this.fetchData();
            });
        },
        handleSetConstituentsEvent(constituents) {
            this.constituents = constituents;
        },
    },
    template: `
    <form style="background-color: white" @submit.prevent="handleSubmit" >
        <div class="row">
            <fieldset style="width: 100%">
                <legend><h1>Vote for your favorite chili!</h1></legend>
                <div class="row">
                    <div class="col-sm-12 col-md-3">
                        <label for="votername">Your name</label>
                    </div>
                    <div class="col-sm-12 col-md">
                        <input type="text" id="votername" v-model="votername" placeholder="Voter name" required/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 col-md-3">
                        <label for="honest">I'm voting for myself (honest)</label>
                    </div>
                    <div class="col-sm-12 col-md">
                        <input type="checkbox" id="honest" v-model="honest" />
                    </div>
                </div>
            </fieldset>
        </div>
        <hr />
        <div class="row">
            <div class="collapse" style="width: 100%">
                <input type="checkbox" id="collapse-instructions" checked aria-hidden="true">
                <label for="collapse-instructions" aria-hidden="true">Instructions</label>
                <div>
                  <ol>
                    <li>Enter your name.</li>
                    <li>Decide whether to be honest.</li>
                    <li>Rank your most favorite chili 1.</li>
                    <li>Rank your second favorite chili 2.</li>
                    <li>You can rank as many or as few chili as you want.</li>
                    <li>Click submit at the bottom.</li>
                  </ol>
                </div>
            </div>
        </div>
        <hr />
        <constituents-list
            :constituents="constituents"
            @setConstituentsEvent="handleSetConstituentsEvent"
        />
        <hr />
        <div class="row">
            <button class="primary" @click="handleSubmit">Submit Vote</button>
        </div>
    </form>
  `
}).mount('#app')
