export const CopyClipboard = (el, setCopySuccess) => {
    console.log("in copy clipboard")

    const updateClipboard = (newClip) => {
        navigator.clipboard.writeText(newClip).then(
            () => {
                setCopySuccess("Copied!");
            },
            () => {
                setCopySuccess("Copy failed!");
            }
        );
    }

    const copyLink = (el) => {
        navigator.permissions
            .query({ name: "clipboard-write" })
            .then((result) => {
                console.log("result", result)
                if (result.state === "granted" || result.state === "prompt" || true) {
                    console.log("in copy link result")
                    console.log(el.target.innerText)
                    updateClipboard(el.target.innerText);
                }
            });
    }

    return copyLink(el)
}

