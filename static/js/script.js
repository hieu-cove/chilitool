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
                .then((data) => { this.constituents = data; });
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
            ).then((data) => {
                this.votername = '';
                this.honest = false;
                this.constituents = [];
                this.fetchData();
            }, (data) => {
                console.log(data);
            });
        },
        handleSetConstituentsEvent(constituents) {
            this.constituents = constituents;
        },
    },
    computed: {
        isVotingEnded() {
            return new Date() >= new Date("2022-10-18T17:30Z");
        }
    },
    template: `
    <form style="background-color: white" @submit.prevent="handleSubmit" v-if="!isVotingEnded">
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
                    <li>Chilis can have the same rank.</li>
                    <li>You can rank as many or as few chili as you want.</li>
                    <li>All unranked chilis are treated as if they are the lowest ranked.</li>
                    <li>Click submit at the bottom to submit your vote.</li>
                    <li>You can revise your vote at any time. Just use the same name.</li>
                  </ol>
                </div>
            </div>
        </div>
        <hr />
        <div class="row">
            <div class="collapse" style="width: 100%">
                <input type="checkbox" id="collapse-about" aria-hidden="true">
                <label for="collapse-about" aria-hidden="true">About voting method</label>
                <div>
                  <p>This voting method is called the Copeland's method. Read more <a href="https://en.wikipedia.org/wiki/Copeland%27s_method#Voting_mechanism">here</a>.</p>
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
    <div class="row" v-if="isVotingEnded">
        <h1>Voting has ended! Checkout of the <a href="/result">result</a>!</h1>
    </div>
  `
}).mount('#app')
