const BACKEND_URL = "http://localhost:5000"; // Your Node.js server

document.addEventListener("DOMContentLoaded", () => {
    const downloadForm = document.getElementById("downloadForm");
    const videoList = document.getElementById("video-list");
    const status = document.getElementById("status");

    // Download form
    if (downloadForm) {
        downloadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const url = document.getElementById("url").value;
            const filename = document.getElementById("filename").value;

            status.textContent = "Downloading... Please wait.";

            try {
                const res = await fetch(`${BACKEND_URL}/download`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url, filename }),
                });

                const data = await res.json();

                if (data.success) {
                    status.innerHTML = `
                        ✅ ${data.message}<br />
                        <strong>Filename:</strong> ${data.video.filename}<br />
                        <strong>Size:</strong> ${(data.size / (1024 * 1024)).toFixed(2)} MB
                    `;
                } else {
                    status.textContent = `❌ ${data.message || 'Download failed.'}`;
                }
            } catch (error) {
                console.error(error);
                status.textContent = "❌ Error occurred while downloading.";
            }
        });
    }

    // Show all videos
    if (videoList) {
        fetch(`${BACKEND_URL}/videos`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success || !data.videos.length) {
                    videoList.innerHTML = "<p>No videos found.</p>";
                    return;
                }

                videoList.innerHTML = data.videos
                    .map(
                        (video) => `
                        <div class="video-item">
                            <p><strong>${video.filename}</strong></p>
                            <a href="${video.path}" download>⬇️ Download</a>
                        </div>
                    `
                    )
                    .join("");
            })
            .catch((err) => {
                console.error(err);
                videoList.innerHTML = "<p>❌ Failed to load videos.</p>";
            });
    }
});
