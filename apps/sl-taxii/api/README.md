# SL's TAXII Server

- `config`: configures the server via _Express_ and defines the exposed URL routes.
- `controllers`: handles the GET and POST methods for URL routes and delivers the corresponding responses back to the requester according to `dto`.
- `dto`: defines the structure of objects sent in response from the server to the requester.
- `middleware`: authorises a request by checking the authentication _Bearer Token_ attached into the header and it also generates a unique id for apiroot lookup.
- `routes/TAXII`: contains classes extending RoutesConfig of `config/routes` and specifying which HTTP methods (i.e., GET or POST) are provided by each URL route.
- `services`: implements functions called by `controllers` (e.g., the function `createIpfsAlgorand()` for creating a _STIX object_).
- `thread/status`: uses the _thread.ts_ library to concurrently add a (encrypted) STIX object into IPFS, and the resulting CID is appended as a NFT on the Algorand testnet. Finally, it saves the metadata of STIX object into the Postgres database and returns the txn-id of the NFT.
- `types`: defines the _Transaction Package_ type used by the `stix_object.service.ts` file.
- `utils`: contains functions to process data.
