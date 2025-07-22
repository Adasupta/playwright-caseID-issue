import { request } from '@playwright/test';

let projectId = null;
async function createProject() {
    const apiRequestContext = await request.newContext();
    const BASE_URL = process.env.API_URL;
    const API_Token = await getToken();
    console.log('API Token:', API_Token);
    const project_name = 'SmokeTest' + Date.now();
    const project_description = 'Automation';

    const response = await apiRequestContext.post(`${BASE_URL.replace(/\/$/, '')}/project`, {
        headers: {
            'stormedaccesstoken': API_Token,
            'Content-Type': 'application/json'
        },
        data: {
            timezone: "Etc/UTC",
            language: "English",
            multifactorAuthenticationMethod: "0",
            projectName: project_name,
            projectDescription: project_description,
            nearDupeThreadingEnabled: true,
            contractCode: ""
        }
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let responseBody;
    try {
        responseBody = JSON.parse(responseText);
    } catch (e) {
        throw new Error('Response is not valid JSON: ' + responseText);
    }

    console.log('Status:', response.status());
    console.log('Response body:', responseBody);

    expect(response.ok()).toBeTruthy();
    await apiRequestContext.dispose();

    // Return projectId from the response
    return responseBody.projectId;
}


// Usage in your test
// await createProject();

let API_Token = null;
async function getToken() {
    const Test_URL = process.env.API_URL;
    const apiRequestContext = await request.newContext();
    const url = `${Test_URL.replace(/\/?$/, '/')}token`;
    console.log('Requesting token from:', url);
    const headers = {
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, *'
    };
    const data = {
        email: process.env.CLIENTADMIN_USERNAME,
        password: process.env.CLIENTADMIN_PASSWORD
    };


    const response = await apiRequestContext.post(url, {
            headers,
            data
        });
        const responseText = await response.text();
        //console.log('Raw response:', responseText);
        let responseBody;
        try {
            responseBody = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Response is not valid JSON');
        }
        //await apiRequestContext.dispose();
        if (!response.ok()) {
            throw new Error(`Failed to get token: ${responseBody.message || 'Unknown error'}`);
        }
    console.log('Token received:', responseBody);
    API_Token = responseBody.stormedAccessToken;

    return responseBody.stormedAccessToken;
    
}

async function create_custodian(firstName,lastName,projectId)
{
    
    if (!API_Token) {
        API_Token = await getToken();
    }
    
    const Test_URL = process.env.API_URL;
    const apiRequestContext = await request.newContext();
    const url = `${Test_URL.replace(/\/?$/, '/')}project/custodian`;
    console.log('Requesting token from:', url);
    const headers = {
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, *',
        'stormedaccesstoken': API_Token
    };
    const data = {
        projectId: projectId,
        firstName: firstName,
        lastName: lastName
    };
    const response = await apiRequestContext.post(url, {
        headers,
        data
    });
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    let responseBody;
    try {
        responseBody = JSON.parse(responseText);
    } catch (e) {
        throw new Error('Response is not valid JSON');
    }
    //await apiRequestContext.dispose();
    if (!response.ok()) {
        throw new Error(`Failed to get token: ${responseBody.message || 'Unknown error'}`);
    }
    console.log('Token received:', responseBody);
    return responseBody.custodianId;
}


module.exports = { getToken, create_custodian };

