// Function to fetch and display the list of people
async function fetchPeople() {
    try {
        const response = await fetch('/person');
        const people = await response.json();
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Clear table content before adding new rows

        people.forEach(person => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${person.name}</td>
                <td>${person.age}</td>
                <td>${person.gender}</td>
                <td>${person.mobile}</td>
                <td class="actions">
                    <button onclick="editPerson('${person._id}')">Edit</button>
                    <button class="delete-btn" onclick="confirmDelete('${person._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching people:", error);
    }
}

// Event listener to handle form submission for creating a new person
document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const person = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        mobile: document.getElementById('mobile').value
    };

    try {
        const response = await fetch('/person', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(person)
        });

        if (response.ok) {
            fetchPeople();
            document.getElementById('create-form').reset();
        } else {
            console.error("Failed to add person:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding person:", error);
    }
});

// Function to display the update form with a person's data
async function editPerson(id) {
    try {
        const response = await fetch(`/person/${id}`);
        const person = await response.json();

        // Show the Update Form
        document.getElementById('update-title').style.display = 'block';
        document.getElementById('update-form').style.display = 'block';
        
        // Populate the form fields with the current data
        document.getElementById('update-name').value = person.name;
        document.getElementById('update-age').value = person.age;
        document.getElementById('update-gender').value = person.gender;
        document.getElementById('update-mobile').value = person.mobile;

        // Handle the form submission for updating the person
        document.getElementById('update-form').onsubmit = async (e) => {
            e.preventDefault();

            const updatedPerson = {
                name: document.getElementById('update-name').value,
                age: parseInt(document.getElementById('update-age').value),
                gender: document.getElementById('update-gender').value,
                mobile: document.getElementById('update-mobile').value
            };

            // Send the updated data to the server
            await fetch(`/person/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPerson)
            });

            // Refresh the people list
            fetchPeople();

            // Reset and hide the form
            document.getElementById('update-form').reset();
            document.getElementById('update-form').style.display = 'none';
            document.getElementById('update-title').style.display = 'none';
        };
    } catch (error) {
        console.error("Error fetching person for edit:", error);
    }
}

// Function to confirm deletion
function confirmDelete(id) {
    const confirmation = window.confirm("Are you sure you want to delete this person?");
    if (confirmation) {
        deletePerson(id);
    }
}

// Function to delete a person
async function deletePerson(id) {
    try {
        await fetch(`/person/${id}`, { method: 'DELETE' });
        fetchPeople();  // Refresh the people list after deletion
    } catch (error) {
        console.error("Error deleting person:", error);
    }
}

// Fetch and display the people list on page load
fetchPeople();
