// Register User
function register() {
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const membership_type = document.getElementById('membership-type').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password, membership_type }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error(err));
}

// Login User
function login() {
    const name = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token); // Store token for authenticated requests
                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('book-section').style.display = 'block';
                fetchBooks(); // Fetch books after login
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error(err));
}

// Fetch all books (already included above)
// Add Book
function addBook() {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const type = document.getElementById('book-type').value;
    const token = localStorage.getItem('token'); // Retrieve the token

    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ title, author, type }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchBooks(); // Refresh the book list
            document.getElementById('add-book-form').style.display = 'none'; // Hide form
        })
        .catch(err => console.error(err));
}

// Other functions for issuing and returning books, paying fines, etc.

// Issue a Book
function issueBook(bookId) {
    const token = localStorage.getItem('token'); // Get JWT token

    fetch('/api/issue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ book_id: bookId }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error(err));
}

// Return a Book
function returnBook(transactionId) {
    const token = localStorage.getItem('token'); // Get JWT token

    fetch('/api/return', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ transaction_id: transactionId }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error(err));
}

// Pay Fine
function payFine(transactionId, fineAmount) {
    const token = localStorage.getItem('token'); // Get JWT token

    fetch('/api/pay-fine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ transaction_id: transactionId, finePaid: fineAmount }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error(err));
}

// Update Membership
function updateMembership(newMembership) {
    const token = localStorage.getItem('token'); // Get JWT token

    fetch('/api/update-membership', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ membership_type: newMembership }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => console.error(err));
}


