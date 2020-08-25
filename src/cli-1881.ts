#!/usr/bin/env node
import fetch from 'node-fetch'
import { SearchResult, SearchContact, LookupContact } from './interfaces'

const subscriptionKey = process.env.OPPLYSNINGEN_SUBSCRIPTION_KEY || ''
if (!subscriptionKey) {
    console.error('Environment variable for your subscription key is not set.')
}

const headers: Record<string, string> = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
}

async function search(
    query = '',
    type = 'unit',
    page = 1,
    limit = 3,
): Promise<SearchResult<SearchContact>> {
    const queryParams = new URLSearchParams({
        query,
        page: '' + page,
        limit: '' + limit,
    })
    const url = `https://services.api1881.no/search/${type}?${queryParams.toString()}`
    const response = await fetch(url, { headers: headers })
    return response.json()
}

async function lookupId(id: string): Promise<SearchResult<LookupContact>> {
    const url = `https://services.api1881.no/lookup/id/${id}`
    const response = await fetch(url, { headers: headers })
    return response.json()
}

async function search1881(query: string) {
    try {
        const res = await search(query)

        res.contacts.forEach(async (contact: SearchContact) => {
            const lookupresult = await lookupId(contact.id)

            lookupresult.contacts.forEach((contact: LookupContact) => {
                const name =
                    contact.type === 'Person'
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.name

                const phone = contact.contactPoints
                    ? `${contact.contactPoints[0].label}: ${contact.contactPoints[0].value}`
                    : ''
                const address = contact.geography
                    ? contact.geography.address.addressString
                    : ''

                console.log(
                    `${phone}, ${name}, ${address} | ${contact.id} ${contact.type}`,
                )
            })
        })
    } catch (error) {
        console.error('err: ' + error.message)
    }
}

console.log('Querying for: ' + process.argv.slice(2))
search1881(process.argv[2])
