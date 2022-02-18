// import type Realm from 'realm'

const setdef = (type: string, defValue?: unknown) => ({
  type,
  default: defValue,
})

const setidx = (type: string) => ({
  type,
  index: true,
})

export const DataProvider: Realm.ObjectSchema = {
  name: 'DataProvider',
  embedded: true,
  properties: {
    source: 'int',
    providerId: 'int',
  },
}

export const Media: Realm.ObjectSchema = {
  name: 'Media',
  embedded: true,
  properties: {
    createDate: 'date',
    type: setdef('int', 0),
    uri: 'string',
  },
}

export const Tag: Realm.ObjectSchema = {
  name: 'Tag',
  primaryKey: 'name',
  properties: {
    name: 'string',
  },
}

export const Studio: Realm.ObjectSchema = {
  name: 'Studio',
  primaryKey: 'name',
  properties: {
    name: 'string',
    originCountry: 'string?',
    media: 'Media[]',
  },
}

export const Credit: Realm.ObjectSchema = {
  name: 'Credit',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    title: 'Title',
    actor: 'Actor',
    name: 'string?',
    department: 'string?',
    job: 'string?',
  },
}

export const Actor: Realm.ObjectSchema = {
  name: 'Actor',
  primaryKey: '_id',
  properties: {
    _id: 'int',
    createDate: 'date',
    providers: 'DataProvider[]',
    adult: 'bool?',
    gender: 'int?',
    name: 'string',
    search: setidx('string'),
    bio: 'string?',
    credits: 'Credit[]',
    media: 'Media[]',
    tags: 'Tag[]',
  },
}

export const Title: Realm.ObjectSchema = {
  name: 'Title',
  primaryKey: '_id',

  properties: {
    _id: 'objectId',
    createDate: 'date',
    type: setdef('int', 0),

    filePath: 'string',
    filecreatedDate: 'date?',
    fileModifiedAt: 'date?',

    name: 'string',
    meta: 'string?',
    search: setidx('string'),

    library: 'Library',

    providers: 'DataProvider[]',

    overview: 'string?',
    tagline: 'string?',
    releaseDate: 'date?',
    runtime: 'int?',
    adult: 'bool?',

    media: 'Media[]',
    tags: 'Tag[]',
    studios: 'Studio[]',
    playlists: 'Playlist[]',
    credits: 'Credit[]',
  },
}

export const User: Realm.ObjectSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    createDate: 'date',
    username: 'string',
    salt: 'string',
    hash: 'string',
    providerType: 'int',
    displayName: 'string?',
    lastName: 'string?',
    firstName: 'string?',
    middleName: 'string?',
    emails: 'string[]',
    photos: 'Media[]',
  },
}

export const Library: Realm.ObjectSchema = {
  name: 'Library',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    createDate: 'date',
    name: 'string',
    path: 'string',
    type: 'int',
  },
}

export const Playlist: Realm.ObjectSchema = {
  name: 'Playlist',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    createDate: 'date',
    name: 'string',
    titles: 'Title[]',
    rule: 'string',
  },
}

export const Server: Realm.ObjectSchema = {
  name: 'Server',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    createDate: 'date',
    name: 'string',
    libraries: 'Library[]',
    // privatePort: 'int',
    // privateUrl: 'string',
    // publicPort: 'int',
    // publicUrl: 'string',
    // watchLibrary: setdef('bool', true),
    // generateVideoPreviewThumbnails: setdef('bool', true),
    // backup: setdef('bool', true),
    // backupPath: 'string?',
    // backupInterval: setdef('int', 14),
    // backupRetention: setdef('int', 1),
  },
}

export const Config: Realm.ObjectSchema = {
  name: 'Config',
  properties: {
    'tmdb.api_key': 'string',
    'tmdb.access_token': 'string',
    'service.port': 'string',
    'admin.port': 'string',
  },
}

export const Session: Realm.ObjectSchema = {
  name: 'Session',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    sid: 'string',
    data: 'string',
    expiresAt: 'date',
  },
}

export const LibraryScan: Realm.ObjectSchema = {
  name: 'LibraryScan',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    startTime: 'date',
    endTime: 'date',
  },
}
