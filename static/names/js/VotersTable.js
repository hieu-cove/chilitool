import VoterRow from "./VoterRow.js";

export default {
    props: {
        voters: Array
    },
    components: {
        VoterRow
    },
    template: `
    <table style="max-height: 1000px">
        <caption>Chili Voters</caption>
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody id="voters-table-body">
            <voter-row
                v-for="voter in voters"
                :voterId="voter.id"
                :name="voter.name"
            />
        </tbody>
    </table>
    `
}
