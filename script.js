"use strict";

// DOM Elements
const menuButtonElement = document.getElementById("menu-button");
const menuNavElement = document.getElementById("nav");
const formElement = document.getElementById("form");
const optionInputList = document.querySelectorAll(".option__input");
const inputTextElement = document.getElementById("input-text");
const deleteButtonElement = document.getElementById("delete-button");
const messageElement = document.getElementById("message");
const animatedLayerList = document.querySelectorAll(".animal__layer--animated");
let selectedOption = document.querySelector(".option__input:checked").value;

// Menu

// Set the expanded state of the menu
const setExpanded = (expand) => {
  menuButtonElement.setAttribute("aria-expanded", expand ? "true" : "false");
  menuNavElement.hidden = !expand;
};

// Toggle menu visibility on button click
menuButtonElement.addEventListener("click", () => setExpanded(menuNavElement.hidden));

// Parallax

// Initialize parallax effect on scroll
const initParallax = () => {
  window.addEventListener("scroll", () => {
    const top = window.pageYOffset;
    const fixedLayers = document.getElementsByClassName("parallax__layer--fixed");

    Array.from(fixedLayers).forEach((layer) => {
      const speed = layer.getAttribute("data-speed");
      const yPos = -(top * speed) / 100;
      layer.style.transform = `translate3d(0px, ${yPos}px, 0px)`;
    });
  });
};

// Start parallax effect on page load
document.body.onload = initParallax;

// Animation

// Remove animation class after animation ends
animatedLayerList.forEach((layer) => {
  layer.addEventListener("animationend", (e) => {
    e.target.classList.remove("animation");
  });
});

// Animate the selected animal
const animateSelectedAnimal = () => {
  const selectedAnimalLayer = document.getElementById(`${selectedOption}-layer-1`);
  if (selectedAnimalLayer && !selectedAnimalLayer.classList.contains("animation")) {
    selectedAnimalLayer.classList.add("animation");
  }
};

// Animal Classes
class Animal {
  constructor(sound) {
    this.sound = sound;
  }

  // Generate a sentence with the animal's sound
  speak(sentence) {
    if (!sentence.trim()) return "";
    return sentence
      .split(" ")
      .map((word) => (word.trim() ? `${word} ${this.sound}` : ""))
      .join(" ");
  }
}

class Lion extends Animal {
  constructor() {
    super("roar");
  }
}

class Tiger extends Animal {
  constructor() {
    super("grrr");
  }
}

// Message Handling

// Update the message text based on the selected animal and input text
const updateMessage = (sentence) => {
  const animalInstance = selectedOption === "lion" ? new Lion() : new Tiger();
  messageElement.textContent = animalInstance.speak(sentence);
};

// Clear the input text and message
const deleteMessage = () => {
  inputTextElement.value = ""; // Clear input text
  messageElement.textContent = ""; // Clear message
  deleteButtonElement.disabled = true;
};

// Animal Display Handling

// Update the displayed animal based on the selected option
const showSelectedAnimal = (animal) => {
  const animalElement = document.getElementById("animal");
  animalElement.setAttribute("data-option", animal);
};

// Event Listeners

// Handle option change events
optionInputList.forEach((optionRadioElement) =>
  optionRadioElement.addEventListener("change", (e) => {
    deleteMessage();
    showSelectedAnimal(e.target.value);
    selectedOption = e.target.value; // Update selectedOption immediately
  }));

// Handle input text changes
inputTextElement.addEventListener("input", (e) => {
  const text = e.target.value;
  if (selectedOption) {
    updateMessage(text);
    if (text) {
      deleteButtonElement.disabled = false;
      animateSelectedAnimal();
    } else {
      deleteButtonElement.disabled = true;
    }
  }
});

// Handle delete button click
deleteButtonElement.addEventListener("click", deleteMessage);

// Handle form submit event
formElement.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get the input text value
  const sentence = inputTextElement.value;

  // Update the message text based on the input
  updateMessage(sentence);

  // Get the updated message content
  const message = messageElement.textContent;

  // If there is a message, generate a WhatsApp URL and open it in a new tab
  if (message) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank"); // Open the WhatsApp URL in a new browser tab
  }
});