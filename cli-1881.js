#!/usr/bin/env node
const fetch = require('node-fetch')

const subscriptionKey = process.env.subscriptionKey;
if (!subscriptionKey) {
    console.error('Environment variable for your subscription key is not set.')
};

const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey
}

function search(query='', type='unit', page=1, limit=3) {
    const queryParams = new URLSearchParams({
        query,
        page,
        limit
    })
    const url = `https://services.api1881.no/search/${type}?${queryParams.toString()}`
    return fetch(url, {headers: headers})
        .then(response => response.json())
}

function lookupId(id) {
    const url = `https://services.api1881.no/lookup/id/${id}`
    return fetch(url, {headers: headers})
        .then(response => response.json())
}

async function search1881(query) {
  try {
    const res = await search(query)

    res.contacts.forEach(async (contact) => {
        lookupresult = await lookupId(contact.id)
        lookupresult.contacts.forEach((contact) => {
            const name = contact.type === 'Person' ? `${contact.firstName} ${contact.lastName}` : contact.name
            const phone = contact.contactPoints != null ? `${contact.contactPoints[0].label}: ${contact.contactPoints[0].value}` : ''
            const address = contact.geography != null ? contact.geography.address.addressString : ''

            console.log(`${phone}, ${name}, ${address} | ${contact.id} ${contact.type}`)
        })
    });

  } catch (error) {
    console.error('err: ' + error.message);
  }
}
console.log('Querying for: ' + process.argv.slice(2))
search1881(process.argv.slice(2))
