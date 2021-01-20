import { message } from 'antd';
import { computed, observable, action } from 'mobx';

import fileDownload from 'utils/file-download';

export default class Exporter {
  download = null;

  filter = null;

  @observable loading = false;

  constructor(download, filter, config) {
    this.download = download;
    this.filter = filter;
    this.config = config;
  }

  @computed get disabled() {
    return this.config?.checkDisable() || false;
  }

  @computed get filename() {
    return `${this.config?.generateFilename() || 'telemetry_work_export'}.xlsx`;
  }

  @computed get confirmMessage() {
    return this.config?.generateConfirmMessage() || 'Выгрузить данные?';
  }

  @action.bound export() {
    this.loading = true;
    const hide = message.loading('Идет выгрузка данных...', 0);
    const { filename } = this;

    const downloadPromise = this.download(this.filter.search)
      .then((file) => fileDownload(file, filename));

    downloadPromise.finally(() => {
      this.loading = false;
      hide();
    });
  }
}
