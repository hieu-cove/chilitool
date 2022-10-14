export default {
    props: {
        dataIndex: Number,
        constituentId: Number,
        name: String,
        score: Number,
    },
    computed: {
        styleObject() {
            const obj = {}
            if (this.dataIndex == 0) {
                obj.background = "gold";
            } else if (this.dataIndex == 1) {
                obj.background = "silver";
            } else if (this.dataIndex == 2) {
                obj.background = "#CD7F32";
            }
            return obj;
        }
    },
    template: `
    <tr>
      <td data-label="Name" :style="styleObject">{{ name }}</td>
      <td data-label="Score" :style="styleObject">{{ score }}</td>
    </tr>
    `
};
