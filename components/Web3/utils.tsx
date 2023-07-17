

export const GetIpfsUrlFromPinata = (pinataUrl: any) => {
    console.log(pinataUrl);
    var IPFSUrl = pinataUrl?.split("/");
    const lastIndex = IPFSUrl?.length;
    IPFSUrl = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1]
    return IPFSUrl;
};