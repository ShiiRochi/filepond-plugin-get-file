/*!
 * FilePondPluginGetFile 1.0.6
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit undefined for details.
 */

/* eslint-disable */

/**
 * Register the download component by inserting the download icon
 */
const registerDownloadComponent = (
  item,
  el,
  labelButtonDownload,
  allowDownloadByUrl
) => {
  const info = el.querySelector('.filepond--file-info-main'),
    downloadIcon = getDownloadIcon(labelButtonDownload);

  info.prepend(downloadIcon);
  downloadIcon.addEventListener('click', () =>
    downloadFile(item, allowDownloadByUrl)
  );
};

/**
 * Generates the download icon
 */
const getDownloadIcon = (labelButtonDownload) => {
  let icon = document.createElement('span');
  icon.className = 'filepond--download-icon';
  icon.title = labelButtonDownload;
  return icon;
};

/**
 * Triggers the actual download of the uploaded file
 */
const downloadFile = (item, allowDownloadByUrl) => {
  // if client want to download file from remote server
  let isDownloadingDirectly = allowDownloadByUrl && !!item.getMetadata('url');

  const a = document.createElement('a');

  // item.getMetadate('url') should return full path to remote server is stored in metadata with key 'url'
  const url = isDownloadingDirectly
    ? item.getMetadata('url')
    : window.URL.createObjectURL(item.file);

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
};

/**
 * Download Plugin
 */
const plugin = (fpAPI) => {
  const { addFilter, utils } = fpAPI;
  const { Type, createRoute } = utils;

  // called for each view that is created right after the 'create' method
  addFilter('CREATE_VIEW', (viewAPI) => {
    // get reference to created view
    const { is, view, query } = viewAPI;

    // only hook up to item view
    if (!is('file')) {
      return;
    }

    // create the get file plugin
    const didLoadItem = ({ root, props }) => {
      const { id } = props;
      const item = query('GET_ITEM', id);

      if (!item || item.archived) {
        return;
      }

      const labelButtonDownload = root.query('GET_LABEL_BUTTON_DOWNLOAD_ITEM');

      const allowDownloadByUrl = root.query('GET_ALLOW_DOWNLOAD_BY_URL');

      registerDownloadComponent(
        item,
        root.element,
        labelButtonDownload,
        allowDownloadByUrl
      );
    };

    // start writing
    view.registerWriter(
      createRoute(
        {
          DID_LOAD_ITEM: didLoadItem,
        },
        ({ root, props }) => {
          const { id } = props;
          const item = query('GET_ITEM', id);

          // don't do anything while hidden
          if (root.rect.element.hidden) return;
        }
      )
    );
  });

  // expose plugin
  return {
    options: {
      labelButtonDownloadItem: ['Download file', Type.STRING],
      allowDownloadByUrl: [false, Type.BOOLEAN],
    },
  };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';
if (isBrowser) {
  document.dispatchEvent(
    new CustomEvent('FilePond:pluginloaded', { detail: plugin })
  );
}

export default plugin;
