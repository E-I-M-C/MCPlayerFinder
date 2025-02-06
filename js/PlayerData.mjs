async function convertToJson(res) {
    const jsonResponse = await res.json();
    if (res.ok) {
        return jsonResponse;
    } else {
        throw { name: 'servicesError', message: jsonResponse };
    }
}

export async function getData(url, dataIdentifier) {
    const response = await fetch(url+dataIdentifier);
    const data = await convertToJson(response);
    return data;
}

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
        return null;
    }
}