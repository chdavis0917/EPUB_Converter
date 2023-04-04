import JSZip from 'jszip';

export const unzipEpubFile = async (epubFile) => {
  const zipFile = await epubFile.arrayBuffer();
  const zip = new JSZip();
  const epubContents = await zip.loadAsync(zipFile);
  return epubContents;
};

export const modifyEpubContents = async (zip) => {
  const htmlFiles = Object.keys(zip.files).filter((filename) => filename.endsWith('.html'));

  for (let i = 0; i < htmlFiles.length; i++) {
    const filename = htmlFiles[i];
    const content = await zip.file(filename).async('text');
    const modifiedContent = content.replace(/\b(\w{1,3}|\w{13,})\b/g, '<span style="font-weight:bold">$1</span>');
    zip.file(filename, modifiedContent);
  }

  return zip;
};

export const generateModifiedEpub = async (zip, book) => {
  const modifiedZipFile = await zip.generateAsync({ type: 'blob' });

  const blobUrl = window.URL.createObjectURL(modifiedZipFile);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${book.filename()}-modified.epub`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const convertEpub = async (epubFile) => {
  const book = await ePub(epubFile);
  const contents = await unzipEpubFile(epubFile);
  const modifiedZip = await modifyEpubContents(contents);
  await generateModifiedEpub(modifiedZip, book);
};
