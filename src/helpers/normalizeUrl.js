const normalizeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname;
  } catch (error) {
    return url;
  }
};

export default normalizeUrl;
