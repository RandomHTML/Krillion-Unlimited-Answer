import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getFirestore, getDocs, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMSqPlwKTaEblHw-JVfVDEd7_rBKW65B8",
    authDomain: "krillion-unlimited-answers.firebaseapp.com",
    projectId: "krillion-unlimited-answers",
    storageBucket: "krillion-unlimited-answers.firebasestorage.app",
    messagingSenderId: "918396492872",
    appId: "1:918396492872:web:fd9cf9e5e26935d3060c7d",
    measurementId: "G-8XEKG6WG8B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const addQuestionButton = document.getElementById("add_questions_btn");
addQuestionButton.addEventListener("click", async () => {
    let addQuestionInput = document.getElementById("add_question_input").value
    let addAnswerInput = document.getElementById("add_answer_input").value

    if (addAnswerInput.endsWith('.')) {
        addAnswerInput = addAnswerInput.slice(0, -1)
    }

    await setDoc(doc(db, "Question and Answer Pair", addQuestionInput), {
        answer: addAnswerInput
    });

    addQuestionInput.innerText = ""
    addAnswerInput.innerText = ""
})

let answerArray = []
const answerOutput = document.querySelector(".answer_box")
let addQuestionInput = document.getElementById("find_question_input").value

const findQuestionButton = document.getElementById("find_questions_btn");
findQuestionButton.addEventListener("click", async () => {
    const questionsCollectionRef = collection(db, 'Question and Answer Pair');
    const querySnapshot = await getDocs(questionsCollectionRef);
    const questionsDictionary = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    answer.innerText = ""
    addQuestionInput = document.getElementById("find_question_input").value
    for (const [count, pair] of Object.entries(questionsDictionary)) {
        if (pair["id"].includes(addQuestionInput)) {
            answerArray[pair["id"]] = pair["answer"]
            answer.innerText += pair["id"] + ": " + pair["answer"] + "\n"
            answerOutput.style.display = "block"
        }
    }

    answerArray = []
})

const exit = document.getElementById("exit")
exit.addEventListener("click", () => {
    answerOutput.style.display = "none"
    answer.innerText = ""
})