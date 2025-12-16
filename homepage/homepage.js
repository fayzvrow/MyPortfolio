const el = document.getElementById("typewriter");
const cursor = document.getElementById("cursor");

const commands = [
    {
        prompt: "fabdulkadir16 ~ %",
        command: "cd projects/mywebsite",
        pauseAfterPrompt: 600
    },
    {
        prompt: "fabdulkadir16 mywebsite %",
        command: "open homepage.html",
        pauseAfterPrompt: 0
    },
    {
        prompt: "",
        command: "# Explore my portfolio to see how I bring ideas to life",
        pauseAfterPrompt: 0
    }
];

let lineIndex = 0;
let charIndex = 0;
let promptShown = false;

function typeCommand() {
    if (lineIndex >= commands.length) return;

    const current = commands[lineIndex];

    if (!promptShown && current.prompt) {
        el.textContent += current.prompt + " ";
        promptShown = true;
        if (current.pauseAfterPrompt > 0) {
            setTimeout(typeCommand, current.pauseAfterPrompt);
            return;
        }
    }

    if (charIndex < current.command.length) {
        el.textContent += current.command.charAt(charIndex);
        charIndex++;
        setTimeout(typeCommand, 20);
    } else {
        el.textContent += "\n";
        charIndex = 0;
        lineIndex++;
        promptShown = false;
        setTimeout(typeCommand, 500);
    }
}

window.addEventListener("load", () => {
    typeCommand();
});