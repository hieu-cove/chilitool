constituents_list = document.getElementById("constituents-table");

template_constituent_item = document.getElementById("template-constituent-item")

fetch('/constituents')
    .then((response) => response.json())
    .then((data) => data.forEach(constituent => {
        const child_elem = template_constituent_item.cloneNode(true);
        console.log(constituent.id);
        child_elem.id = String(constituent.id);
        child_elem.hidden = false;
        child_elem.textContent = constituent.name;
        constituents_list.appendChild(child_elem);
    }));
