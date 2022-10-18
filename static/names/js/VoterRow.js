export default {
    props: {
        voterId: Number,
        name: String,
    },
    template: `
    <tr>
      <td data-label="Name">{{ name }}</td>
    </tr>
    `
};
