document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    let letterCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord() {
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key": "a985fb5d0dmshfbef26b57109b65p17ba74jsn408adde479bd",
                },
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                word = res.word;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");

        fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "a985fb5d0dmshfbef26b57109b65p17ba74jsn408adde479bd",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error();
                }

                const firstLetterId = guessedWordCount * 5 + 1;
                const interval = 200;
                currentWordArr.forEach((letter, index) => {
                    setTimeout(() => {
                        const tileColor = getTileColor(letter, index);

                        const letterId = firstLetterId + index;
                        const letterEl = document.getElementById(letterId);
                        letterEl.classList.add("animate__flipInX");
                        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                    }, interval * index);
                });

                guessedWordCount += 1;

                if (currentWord === word) {
                    window.alert("Congratulations!");
                }

                if (guessedWords.length === 6) {
                    window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
                }

                guessedWords.push([]);
            })
            .catch(() => {
                window.alert("Word is not recognised!");
                letterCount--;
            });
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
        return;

    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
                letterCount++;
                console.log(letterCount);
                return;
            }

            if (letter === "del") {
                if (letterCount == 6 || letterCount == 12 || letterCount == 18 || letterCount == 24 || letterCount == 30) {
                    return;
                }
                else {
                    handleDeleteLetter();
                    letterCount--;
                    console.log(letterCount);
                }
                return;
            }

            letterCount++;
            console.log(letterCount);

            updateGuessedWords(letter);
        };
    }
});