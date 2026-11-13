const Book = require('./models/book')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => { // not with parameters
      return Book.find({}).populate('author').exec()
    },
    allAuthors: () => Author.find({}).exec(),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.find({ name: args.author })
      if (author.length !== 0) {
        author = author[0]
      } else {
        author = new Author({ name: args.author })   
        author = await author.save()
      }
      const book = new Book({ ...args, author: author._id })
      return (await book.save()).populate('author')
    },
    editAuthor:  (root, args) => { // not yet
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      const newAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? newAuthor : a)
      return newAuthor
    },
  },
  Author: {
    bookCount: (root) => { // not yet
      return 0
    }
  },
}

module.exports = resolvers
