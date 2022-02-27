export const CopyClipboard = (el, setCopySuccess) => {

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
                if (result.state === "granted" || result.state === "prompt") {
                    updateClipboard(el.target.innerText);
                }
            });
    }

    return copyLink(el)
}

