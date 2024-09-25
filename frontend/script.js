const API_URL = "http://localhost:8080"; // Adjust according to your backend URL

// User signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    alert(data.message || data.error);
});

// User login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message || data.error);

    if (data.token) {
        localStorage.setItem("token", data.token);
        document.getElementById("bookSection").classList.remove("hidden");
        document.getElementById("logoutSection").classList.remove("hidden");
        loadUserBooks(); // Load only the user's books after login
    }
});

// User logout
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    document.getElementById("bookSection").classList.add("hidden");
    document.getElementById("logoutSection").classList.add("hidden");
    location.reload();
});

// Add book
document.getElementById("bookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const genre = document.getElementById("bookGenre").value;
    const availability = document.getElementById("bookAvailability").value;

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/library/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, genre, availability }),
    });

    const data = await response.json();
    alert(data.message || data.error);
    loadUserBooks();
});

// Load user's books
async function loadUserBooks() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/library/getbooks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    const bookItems = document.getElementById("bookItems");
    bookItems.innerHTML = ""; // Clear the list

    if (data.books && data.books.length > 0) {
        data.books.forEach((book) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${book.title} by ${book.author} - ${book.availability ? 'Available' : 'Not Available'}
                <button class="bg-yellow-500 text-white p-1 rounded ml-2" onclick="borrowBook('${book._id}')">Borrow</button>
                <button class="bg-red-500 text-white p-1 rounded ml-2" onclick="returnBook('${book._id}')">Return</button>
                <button class="bg-blue-500 text-white p-1 rounded ml-2" onclick="editBook('${book._id}')">Edit</button>
                <button class="bg-gray-500 text-white p-1 rounded ml-2" onclick="deleteBook('${book._id}')">Delete</button>
            `;
            bookItems.appendChild(li);
        });
    } else {
        bookItems.innerHTML = "<li>No books found.</li>";
    }
}

// Borrow a book
async function borrowBook(bookId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/library/borrow/${bookId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    alert(data.message || data.error);
    loadUserBooks();
}

// Return a book
async function returnBook(bookId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/library/return/${bookId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    alert(data.message || data.error);
    loadUserBooks();
}

// Edit a book
async function editBook(bookId) {
    const title = prompt("Enter new title:");
    const author = prompt("Enter new author:");
    const genre = prompt("Enter new genre:");
    const availability = confirm("Is the book available?");

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/library/update/${bookId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, genre, availability }),
    });

    const data = await response.json();
    alert(data.message || data.error);
    loadUserBooks();
}

// Delete a book
async function deleteBook(bookId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/library/delete/${bookId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    alert(data.message || data.error);
    loadUserBooks();
}
