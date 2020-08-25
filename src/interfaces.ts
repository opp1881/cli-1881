export interface SearchContact {
    type: 'Person'
    id: string
    name: string
    postCode: string
    postArea: string
    infoUrl: string
}

export interface ContactPoint {
    label: string
    main: boolean
    type: 'Phone' | 'MobilePhone'
    value: string
}

export interface Geography {
    municipality: string
    county: string
    region: string
    coordinate: null
    address: {
        street: string
        houseNumber: string
        entrance: string | null
        postCode: string
        postArea: string
        addressString: string
    }
}

export interface LookupContact {
    type: 'Person'
    id: string
    firstName: string
    lastName: string
    name: string
    geography: Geography
    contactPoints?: ContactPoint[]
    infoUrl: string
}

export interface SearchResult<T> {
    count: number
    contacts: T[]
}
