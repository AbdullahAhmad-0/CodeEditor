import { WebContainer } from "@webcontainer/api";

const form: HTMLElement | null = document.getElementById("editor");
const output: HTMLElement | null = document.getElementById("output");

window.addEventListener("load", async () => {
    console.log("Loading...");
    const container = await WebContainer.boot();
    console.log("Container booted");

    container.on("server-ready", (port, url) => {
        if (output) {
            output.innerText += `Server ready: ${url}:${port}\n`;
        }
        document.getElementById("dev-url")?.setAttribute("src", `${url}:${port}`);
    });

    async function run(command: string, args: string[]) {
        const response = await container.spawn(command, args);
        if (response.exit) {
            console.log("Hurray! You got error");
        }

        response.output.pipeTo(
            new WritableStream({
                write(chunk) {
                    if (output) {
                        output.innerText += chunk + "\n";
                    }
                },
            })
        );
    }

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!e.target) {
            return;
        }
        const data = new FormData(e.target as HTMLFormElement);

        const text = data.get("command") as string;
        console.log(text);
        const [command, ...args] = (text || "").split(" ");
        await run(command, args);
    });

    await run("node", ["-v"]);
});