/**
 * Register the download component by inserting the download icon
 */
export const registerDownloadComponent = (item, el, labelButtonDownload, allowDownloadByUrl) => {
    const info = el.querySelector('.filepond--file-info-main'),
          downloadIcon = getDownloadIcon(labelButtonDownload);

    info.prepend(downloadIcon);
    downloadIcon.addEventListener("click", () => downloadFile(item, allowDownloadByUrl));
}

/**
 * Generates the download icon
 */
export const getDownloadIcon = (labelButtonDownload) => {
    let icon = document.createElement('span');
    icon.className = 'filepond--download-icon';
    icon.title = labelButtonDownload;
    return icon;
}

/**
 * Triggers the actual download of the uploaded file
 */
export const downloadFile = (item, allowDownloadByUrl) => {

    // if client want to download file from remote server
    let isDownloadingDirectly = allowDownloadByUrl && !!item.getMetadata('url');

    const a = document.createElement("a");

    // item.getMetadate('url') should return full path to remote server is stored in metadata with key 'url'
    const url = isDownloadingDirectly ? item.getMetadata('url') : window.URL.createObjectURL(item.file);

    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;

    if (isDownloadingDirectly) {
        a.target = '_blank';
    }

    a.download = item.file.name;
    a.click();

    if (!isDownloadingDirectly) {
        window.URL.revokeObjectURL(url);
    }

    a.remove();
}
