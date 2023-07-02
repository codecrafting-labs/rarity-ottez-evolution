export default {

  transformUri (uri) {
    uri = uri.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    return uri;
  }

}