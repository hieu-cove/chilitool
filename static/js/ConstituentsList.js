import ConstituentItem from "./ConstituentItem.js";

export default {
    props: {
        constituents: Array
    },
    emits: ["setConstituentsEvent"],
    components: {
        ConstituentItem
    },
    methods: {
        handleSetRank(constituentId, rank) {
            if (!rank) {
                this.constituents.find((c) => c.id == constituentId).rank = null;
            } else {
                this.constituents.find((c) => c.id == constituentId).rank = Number(rank);
            }
            this.$emit("setConstituentsEvent", this.constituents);
        }
    },
    computed: {
        sortedconstituents: function () {
            function compare(a, b) {
                if (!b.rank) // If b rank is not set, a is first
                    return -1;
                if (!a.rank) // If a rank is not set, b is first
                    return 1;
                if (a.rank < b.rank)
                    return -1;
                if (a.rank > b.rank)
                    return 1;
                return 0;
            }
            return this.constituents.sort(compare);
        },
        availableRanks: function () {
            function getRank(c) {
                return c.rank;
            }
            return [...this.constituents.keys()].map((r) => r + 1);
        }
    },
    template: `
    <constituent-item
        v-for="constituent in sortedconstituents"
        :constituentId="constituent.id"
        :name="constituent.name"
        :rank="constituent.rank"
        :availableRanks="availableRanks"
        @setRankEvent="handleSetRank"
    ></constituent-item>
    `
}
