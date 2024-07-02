document.addEventListener('DOMContentLoaded', function () {
    const homePageSection = document.getElementById('home-page');
    const createQuizSection = document.getElementById('create-quiz');
    const takeQuizSection = document.getElementById('take-quiz');
    const quizResultSection = document.getElementById('quiz-result');
    const quizzesList = document.getElementById('quizzes-list');
    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const quizQuestionsContainer = document.getElementById('quiz-questions-container');

    let quizzes = []; // Store quizzes in this array

    // Function to show a specific section and hide others
    function showSection(sectionId) {
        const sections = [homePageSection, createQuizSection, takeQuizSection, quizResultSection];
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    // Function to render quizzes in "Take Quiz" section
    function renderQuizzes() {
        quizzesList.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            quizCard.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <button class="start-quiz-btn small-button" data-quiz-id="${quiz.id}">Start Quiz</button>
            `;
            quizzesList.appendChild(quizCard);
        });

        // Add event listeners to start quiz buttons
        const startQuizButtons = document.querySelectorAll('.start-quiz-btn');
        startQuizButtons.forEach(button => {
            button.addEventListener('click', function () {
                const quizId = parseInt(button.getAttribute('data-quiz-id'));
                const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);
                if (selectedQuiz) {
                    displayQuiz(selectedQuiz);
                } else {
                    console.error('Quiz not found');
                }
            });
        });
    }

    // Button event listeners
    document.getElementById('create-quiz-btn').addEventListener('click', function () {
        showSection('create-quiz');
    });

    document.getElementById('take-quiz-btn').addEventListener('click', function () {
        showSection('take-quiz');
        renderQuizzes();
    });

    document.getElementById('create-back-btn').addEventListener('click', function () {
        showSection('home-page');
    });

    document.getElementById('take-back-btn').addEventListener('click', function () {
        showSection('home-page');
    });

    // Function to handle creating a new quiz
    quizForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const quizTitle = document.getElementById('quiz-title').value;
        const quizDescription = document.getElementById('quiz-description').value;
        const questions = [];

        // Collect questions and options from form
        const questionElements = document.querySelectorAll('#questions-container .question');
        questionElements.forEach(questionElement => {
            const questionText = questionElement.querySelector('input[name="question"]').value;
            const options = [];
            const optionElements = questionElement.querySelectorAll('.option-input');
            optionElements.forEach(optionElement => {
                if (optionElement.value.trim() !== '') { // Ensure non-empty options only
                    options.push(optionElement.value);
                }
            });
            const correctAnswer = questionElement.querySelector('input[name="correct-answer"]').value;

            questions.push({
                text: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        });

        // Create new quiz object
        const newQuiz = {
            id: quizzes.length + 1, // Replace with actual ID generation logic
            title: quizTitle,
            description: quizDescription,
            questions: questions
        };

        // Add new quiz to quizzes array
        quizzes.push(newQuiz);

        // Clear form inputs
        quizForm.reset();

        // Show success message or navigate to home page
        alert('Quiz created successfully!');
        showSection('home-page');
    });

    // Function to handle starting a quiz
    function displayQuiz(quiz) {
        takeQuizSection.innerHTML = ''; // Clear existing content
        const quizCard = document.createElement('div');
        quizCard.classList.add('quiz-card');
        quizCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <form id="taking-quiz-form">
                <input type="hidden" id="quiz-id" name="quiz-id" value="${quiz.id}">
                <div id="quiz-questions-container"></div>
                <button type="submit" id="submit-quiz-btn" class="small-button">Submit Quiz</button>
            </form>
        `;
        takeQuizSection.appendChild(quizCard);
        const quizQuestionsContainer = document.getElementById('quiz-questions-container');
        quiz.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.innerHTML = `
                <h4>Question ${index + 1}: ${question.text}</h4>
            `;
            question.options.forEach((option, optionIndex) => {
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.id = `option-${index}-${optionIndex}`;
                optionInput.name = `question-${index}`;
                optionInput.value = option;
                const optionLabel = document.createElement('label');
                optionLabel.htmlFor = `option-${index}-${optionIndex}`;
                optionLabel.textContent = option;
                questionDiv.appendChild(optionInput);
                questionDiv.appendChild(optionLabel);
                const br = document.createElement('br');
                questionDiv.appendChild(br);
            });
            quizQuestionsContainer.appendChild(questionDiv);
        });

        // Handle quiz submission
        document.getElementById('taking-quiz-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const quizId = parseInt(document.getElementById('quiz-id').value);
            const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);
            if (selectedQuiz) {
                const form = event.target;
                const questions = selectedQuiz.questions;
                let totalQuestions = questions.length;
                let correctAnswers = 0;
                questions.forEach((question, index) => {
                    const selectedOption = form.elements[`question-${index}`].value;
                    if (selectedOption === question.correctAnswer) {
                        correctAnswers++;
                    }
                });
                const score = (correctAnswers / totalQuestions) * 100;
                showResult(score);
            } else {
                console.error('Quiz not found');
            }
        });

        showSection('take-quiz');
    }

    // Function to display quiz result
    function showResult(score) {
        quizResultSection.innerHTML = ''; // Clear existing content
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result-container');
        resultContainer.innerHTML = `
            <h2>Quiz Completed!</h2>
            <p>Your Score: ${score.toFixed(2)}%</p>
            <button id="result-back-btn" class="small-button">Back to Home</button>
        `;
        quizResultSection.appendChild(resultContainer);

        document.getElementById('result-back-btn').addEventListener('click', function () {
            showSection('home-page');
        });

        showSection('quiz-result');
    }

    // Function to add a new question input set in the create quiz section
    document.getElementById('add-question-btn').addEventListener('click', function () {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <label for="question">Question:</label>
            <input type="text" name="question" required><br><br>
            <label for="options">Options:</label><br>
            <input type="text" name="option" class="option-input" placeholder="Option 1" required><br>
            <input type="text" name="option" class="option-input" placeholder="Option 2" required><br>
            <input type="text" name="option" class="option-input" placeholder="Option 3" required><br>
            <input type="text" name="option" class="option-input" placeholder="Option 4" required><br><br>
            <label for="correct-answer">Correct Answer:</label>
            <input type="text" name="correct-answer" required><br><br>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    // Mock data for quizzes (replace with actual data if using backend)
    quizzes = [
        {
            id: 1,
            title: 'General Knowledge Quiz',
            description: 'Test your general knowledge with this quiz!',
            questions: [
                {
                    text: 'What is the capital of France?',
                    options: ['Paris', 'London', 'Rome', 'Berlin'],
                    correctAnswer: 'Paris'
                },
                {
                    text: 'Who wrote the play "Romeo and Juliet"?',
                    options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'George Orwell'],
                    correctAnswer: 'William Shakespeare'
                },
                {
                    text: 'What is the largest planet in our solar system?',
                    options: ['Jupiter', 'Mars', 'Venus', 'Saturn'],
                    correctAnswer: 'Jupiter'
                }
            ]
        },
        {
            id: 2,
            title: 'Math Quiz',
            description: 'Test your math skills with this quiz!',
            questions: [
                {
                    text: 'What is 2 + 2?',
                    options: ['4', '3', '5', '2'],
                    correctAnswer: '4'
                },
                {
                    text: 'What is the square root of 16?',
                    options: ['4', '8', '2', '6'],
                    correctAnswer: '4'
                },
                {
                    text: 'What is 10 * 5?',
                    options: ['50', '30', '25', '15'],
                    correctAnswer: '50'
                }
            ]
        }
    ];
});
