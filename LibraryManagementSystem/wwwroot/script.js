const API_URL = "/api/Books";

// ==================== BOOKS ====================

async function loadBooks() {
const container = document.getElementById("books-container");

if (!container) {
    return;
}
try {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to load books");
    }
    const books = await response.json();
    container.innerHTML = "";
    if (books.length === 0) {
        container.innerHTML = "<p>No books available yet.</p>";
        return;
    }
    books.forEach(book => {
        container.innerHTML += `
            <div class="feature-card">
                <h3>📖 ${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>
                    ${book.isAvailable
                        ? "✅ Available"
                        : "❌ Borrowed"}
                </p>
                ${
                    book.isAvailable
                        ? `<button onclick="borrowBook(${book.id})">
                             📚 Borrow
                           </button>`
                        : `<button disabled>
                             Already Borrowed
                           </button>`
                }
                <br><br>
                <button onclick="deleteBook(${book.id})">
                    🗑️ Delete
                </button>
            </div>
        `;
    });
} catch (error) {
    console.error(error);
    container.innerHTML = "<p>Unable to load books.</p>";
}

}

// ==================== ADD BOOK ====================

async function addBook() {
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const message = document.getElementById("message");

const title = titleInput.value.trim();
const author = authorInput.value.trim();
if (!title || !author) {
    message.textContent = "Please enter title and author.";
    return;
}
const book = {
    title: title,
    author: author,
    isAvailable: true
};
try {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    });
    if (!response.ok) {
        throw new Error("Failed to add book");
    }
    message.textContent = "Book added successfully! 📚";
    titleInput.value = "";
    authorInput.value = "";
    loadBooks();
} catch (error) {
    console.error(error);
    message.textContent = "Unable to add book.";
}

}

// ==================== DELETE BOOK ====================

async function deleteBook(id) {
try {
const response = await fetch($(API_URL)/$(id), {
method: "DELETE"
});

    if (!response.ok) {
        throw new Error("Failed to delete book");
    }
    alert("Book deleted successfully! 🗑️");
    loadBooks();
} catch (error) {
    console.error(error);
    alert("Unable to delete book.");
}

}

// ==================== BORROW BOOK ====================

async function borrowBook(bookId) {

const userId = localStorage.getItem("userId");
if (!userId) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
}
const borrowing = {
    userId: parseInt(userId),
    bookId: bookId
};
try {
    const response = await fetch("/api/Borrowings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(borrowing)
    });
    if (!response.ok) {
        const message = await response.text();
        alert(message);
        return;
    }
    alert("Book borrowed successfully! 📚");
    loadBooks();
} catch (error) {
    console.error(error);
    alert("Unable to borrow book.");
}

}

// ==================== BORROWINGS ====================

async function loadBorrowings() {

const container = document.getElementById("borrowings-container");
if (!container) {
    return;
}
try {
    const response = await fetch("/api/Borrowings");
    if (!response.ok) {
        throw new Error("Failed to load borrowings");
    }
    const borrowings = await response.json();
    if (borrowings.length === 0) {
        container.innerHTML = "<p>No borrowings yet.</p>";
        return;
    }
    container.innerHTML = "";
    borrowings.forEach(borrowing => {
        container.innerHTML += `
            <div class="feature-card">
                <h3>📚 Borrowing #${borrowing.id}</h3>
                <p>
                    Book ID: ${borrowing.bookId}
                </p>
                <p>
                    Borrow Date:
                    ${new Date(borrowing.borrowDate).toLocaleDateString()}
                </p>
                <p>
                    Status:
                    ${borrowing.isReturned
                        ? "✅ Returned"
                        : "📚 Borrowed"}
                </p>
                ${
                    !borrowing.isReturned
                        ? `
                            <button onclick="returnBook(${borrowing.id})">
                                🔄 Return Book
                            </button>
                          `
                        : ""
                }
            </div>
        `;
    });
} catch (error) {
    console.error(error);
    container.innerHTML = "<p>Unable to load borrowings.</p>";
}

}

// ==================== RETURN BOOK ====================

async function returnBook(id) {

try {
    const response = await fetch(
        `/api/Borrowings/return/${id}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        const message = await response.text();
        alert(message);
        return;
    }
    alert("Book returned successfully! 🔄");
    loadBorrowings();
} catch (error) {
    console.error(error);
    alert("Unable to return book.");
}

}

// ==================== REGISTER ====================

async function registerUser() {

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const message = document.getElementById("message");
if (!name || !email || !password) {
    message.textContent = "Please fill in all fields.";
    return;
}
const user = {
    name: name,
    email: email,
    password: password
};
try {
    const response = await fetch("/api/Users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        const error = await response.text();
        message.textContent = error;
        return;
    }
    message.textContent = "Registration successful! 🎉";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
} catch (error) {
    console.error(error);
    message.textContent = "Unable to register.";
}

}

// ==================== LOGIN ====================

async function loginUser() {

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value.trim();
const message = document.getElementById("loginMessage");
if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
}
const user = {
    email: email,
    password: password
};
try {
    const response = await fetch("/api/Users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        const error = await response.text();
        message.textContent = error;
        return;
    }
    const loggedInUser = await response.json();
    localStorage.setItem("userId", loggedInUser.id);
    localStorage.setItem("userName", loggedInUser.name);
    localStorage.setItem("userRole", loggedInUser.role);
    message.textContent = "Login successful! 🎉";
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
} catch (error) {
    console.error(error);
    message.textContent = "Unable to login.";
}

}

// ==================== PAGE LOAD ====================

loadBooks();

if (document.getElementById("borrowings-container")) {
loadBorrowings();
// ==================== USERS ====================

async function loadUsers() {

    const container = document.getElementById("users-container");

    if (!container) {
        return;
    }

    try {

        const response = await fetch("/api/Users");

        if (!response.ok) {
            throw new Error("Failed to load users");
        }

        const users = await response.json();

        container.innerHTML = "";

        users.forEach(user => {

            container.innerHTML += `
                <div class="feature-card">

                    <h3>👤 ${user.name}</h3>

                    <p>Email: ${user.email}</p>

                    <p>Role: ${user.role}</p>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);
        container.innerHTML = "<p>Unable to load users.</p>";

    }
}
// ==================== LOGOUT ====================

function logout() {

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    window.location.href = "/index.html";
}const userName = localStorage.getItem("userName");

if (userName) {
    const nameElement = document.getElementById("userName");

    if (nameElement) {
        nameElement.textContent = `Welcome, ${userName} 👋`;
    }
}
}