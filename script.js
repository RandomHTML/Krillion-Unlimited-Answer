// Initialise Firebase's Firestore

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js"
import { getFirestore, getDocs, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAMSqPlwKTaEblHw-JVfVDEd7_rBKW65B8",
    authDomain: "krillion-unlimited-answers.firebaseapp.com",
    projectId: "krillion-unlimited-answers",
    storageBucket: "krillion-unlimited-answers.firebasestorage.app",
    messagingSenderId: "918396492872",
    appId: "1:918396492872:web:fd9cf9e5e26935d3060c7d",
    measurementId: "G-8XEKG6WG8B"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Create variables
const addButton = document.getElementById("add_btn")
let addQuestionInput = document.getElementById("add_question_input").value
let addAnswerInput = document.getElementById("add_answer_input").value
const inputImg = document.getElementById("add_img")
const findButton = document.getElementById("find_btn")
let findAnswerInput = document.getElementById("find_question_input").value
const outputImg = document.getElementById("find_img")
const answerBox = document.querySelector(".answer_box")
let displayBox = document.querySelector(".display_box")
let displayText = document.querySelector(".display_text")

// Add the section to input questions and answers to the database
// Add event listener to the button when clicked to send information to the database and clear out the form
addButton.addEventListener("click", async () => {
    // Update the value of the variable before submitting to obtain latest information
    addQuestionInput = document.getElementById("add_question_input").value
    addAnswerInput = document.getElementById("add_answer_input").value

    // If the question ends with a fullstop (.), remove the fullstop
    // Database cleaner and easier to organise.
    if (addQuestionInput.endsWith('.')) {
        addQuestionInput = addQuestionInput.slice(0, -1)
    }

    // Update the databse with new information
    await setDoc(doc(db, "Question and Answer Pair", addQuestionInput), {
        answer: addAnswerInput
    })

    // Clear the form
    document.getElementById("add_question_input").value = ""
    document.getElementById("add_answer_input").value = ""

    // Show signal that information has been sent.
    inputImg.style.filter = "hue-rotate(240deg)"
    setTimeout(() => {
        inputImg.style.filter = "hue-rotate(0)"
    }, 1000);
})

// Add the section to find questions and answers from the database

// Add event listener to the button when clicked to retrieve information from the database and clear out the form.
findButton.addEventListener("click", async () => {
    // Update the value of the variable before attempting to retrieve information from the database
    findAnswerInput = document.getElementById("find_question_input").value

    // Obtain the question and answer list from the database.
    const questionsCollectionRef = collection(db, 'Question and Answer Pair')
    const querySnapshot = await getDocs(questionsCollectionRef)
    const questionsDictionary = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    // Clear the answer box
    answerBox.innerHTML = ""

    // Iterates through each question to find one the matches and updates the answer output with it.
    for (const [count, pair] of Object.entries(questionsDictionary)) {
        if (pair["id"].includes(findAnswerInput)) {

            // Create the div box to contain both the text and image
            let container = document.createElement('div');
            container.classList.add("container")

            // Create the clipboard copy element
            let clipboardIMG = document.createElement('img');
            clipboardIMG.classList.add("clipboard_img")
            clipboardIMG.src = "images/clipboard.png";
            clipboardIMG.addEventListener("click", async () => {
                navigator.clipboard.writeText(pair["answer"])
            })

            // Create the text
            let answerText = document.createElement('p');
            answerText.textContent = `${pair["id"]}: ${pair["answer"]}\n`

            // Add elements to page
            answerBox.appendChild(container)
            container.appendChild(answerText)
            container.appendChild(clipboardIMG)

            answerBox.style.display = "block"
        }
    }

    // Create the minise option (X)
    // Put here because minimise option should be at the top of the container
    let minimiseOption = document.createElement('img')
    minimiseOption.id = "exit"
    minimiseOption.src = "images/exit.png"
    // Add event listener to the x to minimise the answer box when clicked.
    minimiseOption.addEventListener("click", () => {
        answerBox.style.display = "none"

        // Clear the form
        // Put here because the answer text is already created at this point
        document.getElementById("find_question_input").value = ""
        document.getElementById("answer_text").innerText = ""
    })
    answerBox.prepend(minimiseOption)

    // Show signal that information has been received.
    outputImg.style.filter = "hue-rotate(240deg)"
    setTimeout(() => {
        outputImg.style.filter = "hue-rotate(0)"
    }, 1000);
})

function displayPopup(display_text) {

}
