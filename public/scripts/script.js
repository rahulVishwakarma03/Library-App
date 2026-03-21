const cloneTemplate = (template) => {
  const templateFragment = document.querySelector(`#${template}`);
  const clone = templateFragment.content.cloneNode(true);
  return clone.querySelector(".book-list");
};

const createBookList = (book) => {
  const fragment = cloneTemplate("list-template");
  const title = fragment.querySelector(".title");
  const author = fragment.querySelector(".author");
  const total = fragment.querySelector(".total");
  const available = fragment.querySelector(".available");

  fragment.id = book.bookId;
  title.textContent = book.title;
  author.textContent = book.author;
  total.textContent = book.total;
  available.textContent = book.available;

  return fragment;
};

const books = [
  { title: "Book", author: "abc", total: 10, available: 5 },
  {  title: "Book",  author: "abc",  total: 10,  available: 5}, 
  { title: "Book", author: "abc", total: 10, available: 5 }
  ];

globalThis.onload = () => {
  const listContainer = document.querySelector("#list-container");
  listContainer.replaceChildren(...books.map(createBookList));

};
