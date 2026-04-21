
async function test() {
    try {
        const resp = await fetch("http://localhost:3002/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Tell me about your Next.js projects" })
        });
        console.log("Status:", resp.status);
        const data = await resp.json();
        console.log("Data:", data);
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

test();
