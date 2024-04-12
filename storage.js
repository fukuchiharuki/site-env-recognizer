const defaultOptions = [
    {
        color: "#E60012",
        title: "Production",
        list: "https://example.com/"
    },
    {
        color: "#F39800",
        title: "Staging",
        list: ""
    },
    {
        color: "#FFF100",
        title: "Development",
        list: ""
    },
    {
        color: "#009944",
        title: "Local",
        list: ""
    },
];

function getOptions(callback) {
    chrome.storage.sync.get(['options'], (value) => {
        const storageOptions = value.options;
        const options = mergeOptions(storageOptions);
        callback(options);
    })
}

function mergeOptions(storageOptions) {
    if (!!storageOptions) {
        return storageOptions
    } else {
        return defaultOptions
    }
}

function setOptions(options) {
    chrome.storage.sync.set({ options });
}
