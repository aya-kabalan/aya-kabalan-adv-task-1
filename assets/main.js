"use strict";
class Book {
    #title;
    #author;
    #category;
    #isAvailable;
    constructor(title, author, category, isAvailable = true) {
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = isAvailable;
    }
    get title() { return this.#title; }
    get author() { return this.#author; }
    get category() { return this.#category; }
    get isAvailable() { return this.#isAvailable; }
    toggleStatus() {
        this.#isAvailable = !this.#isAvailable;
    }
    displayInfo() {
        const status = this.#isAvailable ? "Available" : "Borrowed";
        return `Title: ${this.#title} | Author: ${this.#author} | Category: ${this.#category} | Status: ${status}`;
    }
}
class ReferenceBook extends Book {
    #locationCode;
    constructor(title, author, category, locationCode, isAvailable = true) {
        super(title, author, category, isAvailable);
        this.#locationCode = locationCode;
    }
    displayInfo() {
        return `${super.displayInfo()} | Shelf: ${this.#locationCode}`;
    }
}
class Library {
    #books = [];
    #container;
    constructor(containerId) {
        this.#container = document.getElementById(containerId);
    }
    addBook(book) {
        this.#books.push(book);
        this.renderBooks(this.#books);
    }
    deleteBook(title) {
        this.#books = this.#books.filter(b => b.title !== title);
        this.renderBooks(this.#books);
    }
    toggleAvailability(title) {
        const book = this.#books.find(b => b.title === title);
        if (book) {
            book.toggleStatus();
            this.renderBooks(this.#books);
        }
    }
    searchBooks(key) {
        const lowerQuery = key.toUpperCase();
        const filtered = this.#books.filter(b => b.title.toUpperCase().includes(lowerQuery) ||
            b.author.toUpperCase().includes(lowerQuery));
        this.renderBooks(filtered);
    }
    filterByCategory(category) {
        if (category === "all") {
            this.renderBooks(this.#books);
        }
        else {
            const filtered = this.#books.filter(b => b.category === category);
            this.renderBooks(filtered);
        }
    }
    renderBooks(booksList) {
        this.#container.innerHTML = "";
        if (booksList.length === 0) {
            this.#container.innerHTML = `<p style="color: #aaa;
            text-align: center; 
            grid-column: 1/-1;">No books found.</p>`;
            return;
        }
        booksList.forEach(book => {
            const card = document.createElement("div");
            card.className = "aya-book-card";
            card.innerHTML = `
                <div>
                    <h3>${book.title}</h3>
                    <p>${book.displayInfo()}</p> 
                    <span class="aya-book-status ${book.isAvailable ? 'available' : 'unavailable'}">
                        ${book.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                <div class="aya-book-footer">
                    <button class="aya-btn-delete">Delete</button>
                    <button class="aya-btn-primary toggle-btn" style="padding: 6px 12px; font-size: 0.9rem;">Status</button>
                </div>
            `;
            const deleteBtn = card.querySelector('.aya-btn-delete');
            deleteBtn.addEventListener('click', () => {
                this.deleteBook(book.title);
            });
            const toggleBtn = card.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', () => {
                this.toggleAvailability(book.title);
            });
            this.#container.appendChild(card);
        });
    }
}
const myLibrary = new Library("booksContainer");
myLibrary.addBook(new Book("earth book", "Ali", "geography"));
myLibrary.addBook(new ReferenceBook("stars", "aya kabalan", "nova", "shelf-4"));
const searchInput = document.getElementById("searchInput");
searchInput?.addEventListener("input", () => myLibrary.searchBooks(searchInput.value));
const categoryFilter = document.getElementById("categoryFilter");
categoryFilter?.addEventListener("change", () => myLibrary.filterByCategory(categoryFilter.value));
const modal = document.getElementById("addBookModal");
const openModalBtn = document.getElementById("openModalBtn");
const addBookForm = document.getElementById("addBookForm");
openModalBtn?.addEventListener("click", () => modal.classList.add("active"));
addBookForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const category = document.getElementById("bookCategory").value;
    myLibrary.addBook(new Book(title, author, category));
    addBookForm.reset();
    modal.classList.remove("active");
});
