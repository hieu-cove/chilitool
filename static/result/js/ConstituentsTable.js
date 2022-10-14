import ConstituentRow from "./ConstituentRow.js";

export default {
    props: {
        constituents: Array
    },
    components: {
        ConstituentRow
    },
    template: `
    <table style="max-height: 1000px">
        <caption>Chili Voting Result</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody id="constituents-table-body">
            <constituent-row
                v-for="(constituent, index) in constituents"
                :dataIndex="index"
                :constituentId="constituent.id"
                :name="constituent.name"
                :score="constituent.score"
            />
        </tbody>
    </table>
    `
}
