const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate('author')
      if (args.author) {
        books = books.filter(b => b.author.name === args.author)
      }
      if (args.genre) {
        books = books.filter(b => b.genres.includes(args.genre))
      }
      return books
    },
    allAuthors: () => Author.find({}).exec(),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = (await Author.find({ name: args.author }))[0]
      if (!author) {
        author = new Author({ name: args.author })
        try {
          author = await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({ ...args, author: author._id })
      let newBook
      try {
        newBook = (await book.save()).populate('author')
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      return newBook
    },
    editAuthor:  async (root, args) => {
      const author = (await Author.find({ name: args.name }))[0]
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')
      return books.reduce((sum, book) => (sum + (book.author.name === root.name)), 0)
    }
  },
}

module.exports = resolvers
