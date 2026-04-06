class Book {
    #title: string
    #author: string
    #category: string
    #isAvailable: boolean
    constructor(title: string, author: string, category: string, isAvailable: boolean = true) {
        this.#title = title
        this.#author = author
        this.#category = category
        this.#isAvailable = isAvailable
    }
    get title(): string { return this.#title }
    get author(): string { return this.#author}
    get category(): string { return this.#category }
    get isAvailable(): boolean { return this.#isAvailable}
    toggleStatus(): void {
        this.#isAvailable = !this.#isAvailable
    }
    displayInfo(): string {
        const status = this.#isAvailable ? "Available" : "Borrowed"
        return `Title: ${this.#title} | Author: ${this.#author} | Category: ${this.#category} | Status: ${status}`
    }
}
class ReferenceBook extends Book {
    #locationCode: string
    constructor(title: string, author: string, category: string, locationCode: string, isAvailable: boolean = true) {
        super(title, author, category, isAvailable)
        this.#locationCode = locationCode
    }
    displayInfo(): string {
        return `${super.displayInfo()} | Shelf: ${this.#locationCode}`
    }
}
class Library {
    #books: Book[] = [];
    #container: HTMLElement
    constructor(containerId: string) {
        this.#container = document.getElementById(containerId) as HTMLElement
    }
    addBook(book: Book): void {
        this.#books.push(book)
        this.renderBooks(this.#books)
    }
    deleteBook(title: string): void {
    this.#books = this.#books.filter(b => b.title !== title)
    this.renderBooks(this.#books)
}
    toggleAvailability(title: string): void {
        const book = this.#books.find(b => b.title === title)
        if (book) {
            book.toggleStatus()
            this.renderBooks(this.#books)
        }
    }
    searchBooks(key: string): void {
        const lowerQuery = key.toUpperCase()
        const filtered = this.#books.filter(b => 
            b.title.toUpperCase().includes(lowerQuery) || 
            b.author.toUpperCase().includes(lowerQuery)
        )
        this.renderBooks(filtered)
    }
    filterByCategory(category: string): void {
        if (category === "all") {
            this.renderBooks(this.#books)
        } else {
            const filtered = this.#books.filter(n => n.category === category)
            this.renderBooks(filtered)
        }
    }
private renderBooks(booksList: Book[]): void {
        this.#container.innerHTML = ""
        if (booksList.length === 0) {
            this.#container.innerHTML = `<p style="color: #aaa; text-align: center; grid-column: 1/-1;">No books found.</p>`
            return
        }
        booksList.forEach(book => {
            const card = document.createElement("div")
            card.className = "aya-book-card" 
            card.innerHTML = `
                <div>
                    <h3>${book.title}</h3>
                    <p>By: ${book.author}</p> 
                    <span class="aya-book-status ${book.isAvailable ? 'available' : 'unavailable'}">
                        ${book.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                <div class="aya-book-footer">
                    <button class="aya-btn-info">Info</button>
                    <button class="aya-btn-delete">Delete</button>
                    <button class="aya-btn-primary toggle-btn" style="padding: 6px 12px; font-size: 0.9rem;">Status</button>
                </div>
            `
            const deleteBtn = card.querySelector('.aya-btn-delete') as HTMLButtonElement
            deleteBtn.addEventListener('click', () => {
                this.deleteBook(book.title)
            })
            
            const toggleBtn = card.querySelector('.toggle-btn') as HTMLButtonElement
            toggleBtn.addEventListener('click', () => {
                this.toggleAvailability(book.title)
            })
            const infoBtn = card.querySelector('.aya-btn-info') as HTMLButtonElement
            infoBtn.addEventListener('click', () => {
                alert(book.displayInfo())
            })

            this.#container.appendChild(card)
        })
    }
}
const ayaLibrary = new Library("booksContainer")
ayaLibrary.addBook(new Book("earth book", "Ali", "geography"))
ayaLibrary.addBook(new ReferenceBook("stars", "aya kabalan", "nova","shelf-4"))
const searchInput = document.getElementById("searchInput") as HTMLInputElement
searchInput?.addEventListener("input", () => ayaLibrary.searchBooks(searchInput.value))
const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement
categoryFilter?.addEventListener("change", () => ayaLibrary.filterByCategory(categoryFilter.value))
const modal = document.getElementById("addBookModal") as HTMLElement
const openModalBtn = document.getElementById("openModalBtn") as HTMLButtonElement
const addBookForm = document.getElementById("addBookForm") as HTMLFormElement
openModalBtn?.addEventListener("click", () => modal.classList.add("active"))
addBookForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    const title = (document.getElementById("bookTitle") as HTMLInputElement).value
    const author = (document.getElementById("bookAuthor") as HTMLInputElement).value
    const category = (document.getElementById("bookCategory") as HTMLSelectElement).value
    ayaLibrary.addBook(new Book(title, author, category))
    addBookForm.reset()
    modal.classList.remove("active")
})