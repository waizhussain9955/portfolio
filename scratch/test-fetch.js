async function test() {
    try {
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "hi", history: [] })
        });
        console.log("Status:", res.status);
        const data = await res.text();
        console.log("Data:", data);
    } catch(e) {
        console.error(e);
    }
}
test();
