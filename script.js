document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            question: "If I have to learn how to do something, I learn best when I:",
            options: ["a. Watch someone show me how.", "b. Hear someone tell me how.", "c. Try to do it myself."]
        },
        {
            question: "When I read, I often find that I:",
            options: ["a. Visualize what I am reading in my mind’s eye.", "b. Read out loud or hear the words inside my head.", "c. Fidget and try to 'feel' the content."]
        },
        {
            question: "When asked to give directions, I:",
            options: ["a. See the actual places in my mind as I say them or prefer to draw them.", "b. Have no difficulty in giving them verbally.", "c. Have to point or move my body as I give them."]
        },
        {
            question: "If I am unsure how to write something, I:",
            options: ["a. Write it in order to determine if it looks right.", "b. Spell it out loud in order to determine if it sounds right.", "c. Write it in order to determine if it feels right."]
        },
        {
            question: "When I write I:",
            options: ["a. Am concerned with how neat and well-spaced my letters and words appear.", "b. Often say the letters and words to myself.", "c. Push hard on my pen or pencil and can feel the flow of the words."]
        },
        {
            question: "If I had to remember a list of items, I would remember it best if:",
            options: ["a. Wrote them down.", "b. Said them over and over to myself.", "c. Move around and used my fingers to name each item."]
        },
        {
            question: "I prefer teachers who:",
            options: ["a. Use a board or overhead projector while they lecture.", "b. Talk with lots of expression.", "c. Use hands-on activities."]
        },
        {
            question: "When trying to concentrate, I have a difficult time when:",
            options: ["a. There is a lot of clutter or movement in the room.", "b. There is a lot of noise in the room.", "c. I have to sit still for any length of time."]
        },
        {
            question: "When solving a problem, I:",
            options: ["a. Write or draw diagrams to see it.", "b. Talk myself through it.", "c. Use my entire body or move objects to help me think."]
        },
        {
            question: "When given written instructions on how to build something, I:",
            options: ["a. Read them silently and try to visualize how the parts will fit together.", "b. Read them out loud and talk to myself as I put the part together.", "c. Try to put the parts together first and read later."]
        },
        {
            question: "To keep occupied while waiting, I:",
            options: ["a. Look around, stare, or read.", "b. Talk or listen to others.", "c. Walk around, manipulate things with my hands, or move/shake my feet as I sit."]
        },
        {
            question: "If I had to verbally describe something to another person, I would:",
            options: ["a. Be brief because I do not like to talk at length.", "b. Go into great detail because I like to talk.", "c. Gesture and move around while talking."]
        },
        {
            question: "If someone were verbally describing something to another person, I would:",
            options: ["a. Try to visualize what he/she was saying.", "b. Enjoy listening but want to interrupt and talk myself.", "c. Become bored if her/his description got too long and detailed."]
        },
        {
            question: "When trying to recall names, I remember:",
            options: ["a. Faces but forget names.", "b. Names but forget faces.", "c. The situation where I met the person rather than the person’s name or face."]
        }
    ];

    const quizContainer = document.getElementById("quizContainer");
    const questionCard = document.getElementById("questionCard");
    const introScreen = document.getElementById("introScreen");
    const resultScreen = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");
    const prevButton = document.getElementById("prevButton");
    const retakeButton = document.getElementById("retakeButton");
    const styleName = document.getElementById("styleName");
    const barChart = document.getElementById("barChart");

    let currentQuestionIndex = 0;
    let answers = [];

    // Show the quiz screen when the user clicks 'Begin Test'
    document.getElementById("beginButton").addEventListener("click", () => {
        introScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        renderQuestion();
    });

    // Handle 'Next' and 'Previous' buttons
    nextButton.addEventListener("click", () => {
        if (getSelectedOption() !== null) {
            saveAnswer();
            if (currentQuestionIndex === questions.length - 1) {
                calculateResults();
            } else {
                currentQuestionIndex++;
                renderQuestion();
            }
        } else {
            alert("Please select an option before proceeding.");
        }
    });

    prevButton.addEventListener("click", () => {
        currentQuestionIndex--;
        renderQuestion();
    });

    // Render the current question and options
    function renderQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionCard.innerHTML = `<div class="card">
            <p>${currentQuestion.question}</p>
            ${currentQuestion.options.map((option, index) =>
                `<div>
                    <input type="radio" id="option${index}" name="question" value="${option.charAt(0)}">
                    <label for="option${index}">${option}</label>
                </div>`).join('')}
        </div>`;

        // Restore previously selected answer if available
        const savedAnswer = answers[currentQuestionIndex];
        if (savedAnswer) {
            document.querySelector(`input[value="${savedAnswer}"]`).checked = true;
        }

        // Disable or enable navigation buttons
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
    }

    // Save the selected answer
    function saveAnswer() {
        const selectedOption = getSelectedOption();
        if (selectedOption !== null) {
            answers[currentQuestionIndex] = selectedOption;
        }
    }

    // Get the selected option
    function getSelectedOption() {
        const selectedRadio = document.querySelector('input[name="question"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    }

    // Show result after quiz completion
    function calculateResults() {
        let aCount = 0, bCount = 0, cCount = 0;

        answers.forEach(answer => {
            if (answer === 'a') aCount++;
            else if (answer === 'b') bCount++;
            else if (answer === 'c') cCount++;
        });

        // Determine the predominant style
        const predominantStyle = getPredominantStyle(aCount, bCount, cCount);
        styleName.textContent = predominantStyle;

        // Show the result section and hide the quiz container
        quizContainer.classList.add("hidden");
        resultScreen.classList.remove("hidden");

        // Draw the icon in the barChart canvas
        drawIcon(predominantStyle);
    }

    function getPredominantStyle(aCount, bCount, cCount) {
        const counts = { 'Visual': aCount, 'Auditory': bCount, 'Tactile': cCount };
        return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    }

    // Draw the icon in the canvas based on the predominant style
    function drawIcon(style) {
        const ctx = barChart.getContext("2d");
        ctx.clearRect(0, 0, barChart.width, barChart.height); // Clear the canvas

        const img = new Image();

        switch (style) {
            case 'Visual':
                img.src = 'images/eyes.svg'; // Font Awesome code for eye icon
                break;
            case 'Auditory':
                img.src = "images/ears.svg"; // Font Awesome code for ear icon
                break;
            case 'Tactile':
                img.src = "images/hands.svg"; // Font Awesome code for hand icon
                break;
        }

        // Draw the image in the center of the canvas when it loads
        img.onload = function() {
            const x = (barChart.width - img.width) / 2;
            const y = (barChart.height - img.height) / 2;
            ctx.drawImage(img, x, y);
        };

        // Error handling for image loading issues
        img.onerror = function() {
        console.error(`Failed to load image: ${img.src}`);
        alert(`Error: Could not load image for ${style} processing style.`);
    };
    }

    // Retake the test
    retakeButton.addEventListener("click", () => {
        currentQuestionIndex = 0;
        answers = [];
        resultScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        renderQuestion();
    });
});
