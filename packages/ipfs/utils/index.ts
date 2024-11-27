const extractDirectoryCIDFromURL = (ipfsUrl: string) => {
	return ipfsUrl.substring(7, ipfsUrl.length - 18)
}

export { extractDirectoryCIDFromURL }