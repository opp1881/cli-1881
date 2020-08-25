#!/usr/bin/env node
const fetch = require('node-fetch')

const subscriptionKey = process.env.subscriptionKey;
if (!subscriptionKey) {
    console.error('Environment variable for your subscription key is not set.')
};

const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey
}

async function search(query='', type='unit', page=1, limit=3) {
    return new Promise((resolve, reject) => {
        const url = `https://services.api1881.no/search/${type}?query=${query}&page=${page}&limit=${limit}`
        const request = fetch(url, {headers: headers})
            .then(response => resolve(response.json()))
    })
}

async function lookupId(id) {
    return new Promise((resolve, reject) => {
        const url = `https://services.api1881.no/lookup/id/${id}`
        const request = fetch(url, {headers: headers})
            .then(response => {
                resolve(response.json())
            })
    })
}


async function search1881(query) {
  try {
    const res = await search(query=query)

    res.contacts.forEach(async (contact) => {
        console.log(contact.id)
        lookupresult = await lookupId(contact.id)
        console.log(lookupresult)
    });


    // res.contacts.forEach(({ organizationNumber, type, id, name, postCode, postArea, infoUrl }) => {
    //     console.log(`${organizationNumber}, ${type}, ${id}, ${name}, ${postCode}, ${postArea}\n${infoUrl}`)
    // })

  } catch (error) {
    console.error('err: ' + error.message);
  }
}
console.log('Querying for: ' + process.argv.slice(2))
search1881(query=process.argv.slice(2))
