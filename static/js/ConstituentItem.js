export default {
    props: {
        constituentId: Number,
        name: String,
        rank: null,
        availableRanks: Array
    },
    methods: {
        handleSetRank(event) {
            this.$emit('setRankEvent', this.constituentId, event.target.value)
        }
    },
    computed: {
        rankInputId() {
            return `constituent-rank-${this.constituentId}`;
        },
    },
    template: `
    <div class="row">
        <fieldset style="width: 100%">
            <legend><h3>Chili number {{ constituentId }}</h3></legend>
            <label :for="rankInputId" class="form-label">Rank</label>
            <select :id="rankInputId" :value="rank" @input="handleSetRank">
                <option v-if="rank" value=""></option>
                <option v-if="rank == null" value=""></option>
                <option v-for="availableRank in availableRanks" :value="availableRank" :selected="availableRank == rank">
                    {{availableRank}}
                </option>
            </select>
        </fieldset>
    </div>
    `
};
