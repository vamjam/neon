type WithoutId<T> = Omit<T, 'id' | 'createdAt'>

export default WithoutId
