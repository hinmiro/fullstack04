import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  author: {
    type: String,
    ref: 'User'
  },
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    if (document.populated('user')) {
      returnedObj.author = document.user.username;
    }
  },
});

export default mongoose.model('Blog', blogSchema);
