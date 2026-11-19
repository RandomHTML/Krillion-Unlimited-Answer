// Initialise Firebase's Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import {
    getFirestore,
    getDocs,
    doc,
    setDoc,
    collection,
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMSqPlwKTaEblHw-JVfVDEd7_rBKW65B8",
    authDomain: "krillion-unlimited-answers.firebaseapp.com",
    projectId: "krillion-unlimited-answers",
    storageBucket: "krillion-unlimited-answers.firebasestorage.app",
    messagingSenderId: "918396492872",
    appId: "1:918396492872:web:fd9cf9e5e26935d3060c7d",
    measurementId: "G-8XEKG6WG8B",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create variables
const addForm = document.getElementById("add_section");
let addQuestionInput = document.getElementById("add_question_input").value;
let addAnswerInput = document.getElementById("add_answer_input").value;
const inputImg = document.getElementById("add_img");
const findForm = document.getElementById("find_section");
let findAnswerInput = document.getElementById("find_question_input").value;
const outputImg = document.getElementById("find_img");
const answerBox = document.querySelector(".answer_box");
let displayBox = document.querySelector(".display_box");

// Add the section to input questions and answers to the database
// Add event listener to the button when clicked to send information to the database and clear out the form
addForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the page refresh

    // Update the value of the variable before submitting to obtain latest information
    addQuestionInput = document.getElementById("add_question_input").value;
    addAnswerInput = document.getElementById("add_answer_input").value;

    // If the question ends with a fullstop (.), remove the fullstop
    // Database cleaner and easier to organise.
    if (addQuestionInput.endsWith(".")) {
        addQuestionInput = addQuestionInput.slice(0, -1);
    }

    // Check if any of the values is empty
    if (addQuestionInput == "" || addAnswerInput == "") {
        displayText("Form has incomplete values.", "Bad");
    } else {
        // Update the databse with new information
        let question =
            addQuestionInput.charAt(0).toUpperCase() +
            addQuestionInput.slice(1).toLowerCase();
        let answer = addAnswerInput.toLowerCase();
        await setDoc(doc(db, "Question and Answer Pair", question), {
            answer: answer,
        });

        // Clear the form
        document.getElementById("add_question_input").value = "";
        document.getElementById("add_answer_input").value = "";

        // Show signal that information has been sent.
        inputImg.style.filter = "hue-rotate(240deg)";
        setTimeout(() => {
            inputImg.style.filter = "hue-rotate(0)";
        }, 1000);
        displayText("Database updated.", "Good");
    }
});

// Add the section to find questions and answers from the database

// Add event listener to the button when clicked to retrieve information from the database and clear out the form.
findForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the page refresh

    // Update the value of the variable before attempting to retrieve information from the database
    findAnswerInput = document.getElementById("find_question_input").value;

    // Obtain the question and answer list from the database.
    const questionsCollectionRef = collection(db, "Question and Answer Pair");
    const querySnapshot = await getDocs(questionsCollectionRef);
    const questionsDictionary = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    // Clear the answer box
    answerBox.innerHTML = "";

    // Create a variable that tracks whether there are questions with the given prompt.
    let hasResults = false;

    // Iterates through each question to find one the matches and updates the answer output with it.
    for (const [count, pair] of Object.entries(questionsDictionary)) {
        if (pair["id"].toLowerCase().includes(findAnswerInput.toLowerCase())) {
            // Update the variable to show that at least one question can be found with prompt
            hasResults = true;

            // Create the div box to contain both the text and image
            let container = document.createElement("div");
            container.classList.add("container");

            // Create the text
            let answerText = document.createElement("p");
            let question =
                pair["id"].charAt(0).toUpperCase() + pair["id"].slice(1);
            let answer = pair["answer"].toLowerCase();
            answerText.textContent = `${question}: ${answer}`;

            // Create the clipboard copy element
            let clipboardIMG = document.createElement("img");
            clipboardIMG.classList.add("clipboard_img");
            clipboardIMG.src = "images/clipboard.png";
            clipboardIMG.addEventListener("click", async () => {
                navigator.clipboard.writeText(answer);
            });

            // Add elements to page
            answerBox.appendChild(container);
            container.appendChild(answerText);
            container.appendChild(clipboardIMG);
        }
    }

    // If there is a question found with the prompt given, then show the answer box
    if (hasResults) {
        // Show the answer box if there are results
        answerBox.style.display = "block";

        // Create the minise option (X)
        // Put here because minimise option should be at the top of the container
        let minimiseOption = document.createElement("img");
        minimiseOption.classList.add("minimise_icon");
        minimiseOption.src = "images/exit.png";
        // Add event listener to the x to minimise the answer box when clicked
        minimiseOption.addEventListener("click", () => {
            answerBox.style.display = "none";

            // Clear the form
            // Put here because the answer text is already created at this point
            document.getElementById("find_question_input").value = "";
        });

        // Prepend the minise option to the answer box
        answerBox.prepend(minimiseOption);

        // Show signal that information has been received.
        outputImg.style.filter = "hue-rotate(240deg)";
        setTimeout(() => {
            outputImg.style.filter = "hue-rotate(0)";
        }, 1000);
    } else {
        displayText("No question can be found with this keyword.", "Bad");
    }
});

function displayText(text, status) {
    // Create text
    let displayText = document.createElement("p");
    displayText.innerText = text;

    // Show status icon according to the status given from the function call
    let icon = document.createElement("img");
    icon.classList.add("status_icon");
    if (status == "Good") {
        displayBox.className = "display_box green_background";
        icon.src = "images/successful.png";
    } else if (status == "Bad") {
        displayBox.className = "display_box red_background";
        icon.src = "images/unsuccessful.png";
    }

    // Clear the elements in the display box before updating the box
    displayBox.innerHTML = "";

    // Add the elements to the display box and make the box visible
    displayBox.appendChild(displayText);
    displayBox.appendChild(icon);
    displayBox.style.opacity = "1";

    // Hide the box after 3 seconds.
    setTimeout(() => {
        displayBox.style.opacity = "0";
    }, 3000);
}
