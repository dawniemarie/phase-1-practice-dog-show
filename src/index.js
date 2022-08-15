document.addEventListener('DOMContentLoaded', () => {
    fetchDogs()
    editFormSubmit()
})

//fetch all dogs and renders each dog to page
function fetchDogs() {
    fetch('http://localhost:3000/dogs')
        .then(res => res.json())
        .then(dogs => {
            dogs.forEach((dog) => renderDog(dog))
        })
}

//render dogs within container on page
function renderDog(dog) {
    const container = document.querySelector('#table-body');
    const tr = document.createElement("tr");
    tr.dataset.id = dog.id;
    const tdName = document.createElement("td")
    tdName.textContent = dog.name;
    const tdBreed = document.createElement("td");
    tdBreed.textContent = dog.breed;
    const tdSex = document.createElement("td");
    tdSex.textContent = dog.sex
    const tdBtn = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Dog"

    //edit button event listener with cb function to edit fields
    editBtn.addEventListener('click', () => editBtnClick(dog))

    //append all DOM elements
    tdBtn.append(editBtn);
    container.append(tr, tdName, tdBreed, tdSex, tdBtn)
}

//grabs input edit form and input name attributes
function editBtnClick(dog) {
    const form = document.querySelector('#dog-form');
    form.name.value = dog.name,
        form.breed.value = dog.breed,
        form.sex.value = dog.sex
    //grabbing id info to know which dog is being edited
    form.dataset.id = dog.id
}

//submit event listener for edit dog form
function editFormSubmit() {
    const form = document.querySelector('#dog-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedDog = {
            name: form.name.value,
            breed: form.breed.value,
            sex: form.sex.value
        }
        const dogId = e.target.dataset.id
        updateDog(dogId, updatedDog) // make fetch happen PATCH /dogs/:id
            .then(actualUpdatedDog => {
                // find the tr associated with that dog
                const dogRow = document.querySelector(`tr[data-id='${dogId}']`)
                // update the innerHTML for that row
            dogRow.innerHTML = `
                <td>${actualUpdatedDog.name}</td>
                <td>${actualUpdatedDog.breed}</td>
                <td>${actualUpdatedDog.sex}</td>
                <td><button>Edit Dog</button></td>
            `
        })
    })
}

//PATCH request to update current dog info from edit form inputs
function updateDog(id, updatedDog) {
    return fetch(`http://localhost:3000/dogs/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDog)
    })
        .then(res => res.json())
}


