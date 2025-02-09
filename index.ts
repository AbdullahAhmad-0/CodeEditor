import { WebContainer } from "@webcontainer/api";

window.addEventListener("load", async () => {
    console.log("Loading...");
    const container = await WebContainer.boot();
    console.log("Container booted");

    const response = await container.spawn("node", ["-v"]);

    if (await response.exit) {
        console.log("Hurray! You got error");
    }

    response.output.pipeTo(new WritableStream({
        write(chunk) {
            console.log(chunk);
        }
    }));

    console.log("Done");
});
