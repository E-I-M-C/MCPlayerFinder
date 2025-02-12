// Converts response json object to an object
async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
        return jsonResponse;
    } else {
        return jsonResponse;
    }
}

// Get json data from url and return an object
export async function getData(url, dataIdentifier) {
    const response = await fetch(url+dataIdentifier);
    const data = await convertToJson(response);
    return data;
}

// Get image data from url and return it as a blob
export async function getImage(url, dataIdentifier, params) {
    let fullURL = "";
    if (params) {
        fullURL = url+dataIdentifier+params;
    } else {
        fullURL = url+dataIdentifier;
    }
    const response = await fetch(fullURL);
    if (response.ok) {
        return response.blob();
    } else {
        throw response;
    }
}