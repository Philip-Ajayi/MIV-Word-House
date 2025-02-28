require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Readable } = require('stream');
const path = require('path');

// Initialize express app
const app = express();

// -----------------------
// Global Middleware Setup
// -----------------------
app.use(
  cors({
    origin: 'http://localhost:5173', // Adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------------------------------------------
// Mongoose Connections
// ---------------------------------------------------------

// 1. Sermon DB Connection (hard-coded URI)
const sermonDBURI =
  'mongodb+srv://barryjacob08:HrpYPLgajMiRJBgN@cluster0.ssafp.mongodb.net/yourDBW?retryWrites=true&w=majority';
const sermonDB = mongoose.createConnection(sermonDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
sermonDB.on('connected', () =>
  console.log('Sermon MongoDB connected successfully.')
);
sermonDB.on('error', (err) =>
  console.error('Sermon MongoDB connection error:', err)
);

// 2. Event/Devotional/Blog/Radio DB Connection (from process.env.MONGO_URI)
const eventDBURI = process.env.MONGO_URI;
const eventDB = mongoose.createConnection(eventDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
eventDB.on('connected', () =>
  console.log('Event/Devotional/Blog/Radio MongoDB connected successfully.')
);
eventDB.on('error', (err) => {
  console.error('Event/Devotional/Blog/Radio MongoDB connection error:', err);
  process.exit(1);
});

// 3. Contact DB Connection (for subscribers & nodemailer)
//    Note: This connection uses a separate hard-coded URI.
const contactDBURI =
  'mongodb+srv://barryjacob08:HrpYPLgajMiRJBgN@cluster0.ssafp.mongodb.net/Wordhouse?retryWrites=true&w=majority';
const contactDB = mongoose.createConnection(contactDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
contactDB.on('connected', () =>
  console.log('Contact MongoDB connected...')
);
contactDB.on('error', (err) =>
  console.error('Contact MongoDB connection error:', err)
);

// ---------------------------------------------------------
// Module 1: Sermon Endpoints
// ---------------------------------------------------------

// Define Sermon Schema & Model (using sermonDB)
const sermonSchema = new mongoose.Schema({
  name: String,
  thumbnail: String, // Will store the file ID from Google Drive
  date: Date,
  speaker: String,
  audioFile: String, // Will store the file ID from Google Drive
  series: String,
});
const Item = sermonDB.model('Item', sermonSchema);

// Google Drive Setup for Sermon File Uploads
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    // Replace escaped newline characters with actual newlines
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// Test Google Drive connection
(async () => {
  try {
    const tokenInfo = await auth.getAccessToken();
    console.log(
      'Connected to Google Drive successfully. Token obtained:',
      tokenInfo
    );
  } catch (err) {
    console.error('Google Drive connection error:', err);
  }
})();

// Multer setup for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper functions for Google Drive operations
async function uploadToDrive(file) {
  try {
    const fileMetadata = { name: file.originalname };

    // Convert Buffer to a Readable stream
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    const media = { mimeType: file.mimetype, body: bufferStream };

    // Upload file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });
    const fileId = response.data.id;

    // Make the file publicly readable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return fileId;
  } catch (err) {
    console.error('Error uploading file to Google Drive:', err);
    throw err;
  }
}

async function deleteFromDrive(fileUrl) {
  try {
    if (fileUrl && fileUrl.match(/id=([^&]+)/)) {
      const fileId = fileUrl.match(/id=([^&]+)/)[1];
      console.log('Attempting to delete file with ID:', fileId);
      await drive.files.delete({ fileId });
      console.log('File deleted from Google Drive:', fileId);
    } else {
      console.log('No valid file URL provided, skipping deletion.');
    }
  } catch (err) {
    console.error('Error deleting file from Google Drive:', err);
    throw err;
  }
}

// Sermon Endpoints
app.get('/sermon/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sermon/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(
  '/sermon/upload',
  upload.fields([{ name: 'thumbnail' }, { name: 'audioFile' }]),
  async (req, res) => {
    try {
      const thumbnailFileId = req.files.thumbnail
        ? await uploadToDrive(req.files.thumbnail[0])
        : null;
      const audioFileFileId = req.files.audioFile
        ? await uploadToDrive(req.files.audioFile[0])
        : null;

      const newItem = new Item({
        name: req.body.name,
        thumbnail: thumbnailFileId,
        date: new Date(req.body.date),
        speaker: req.body.speaker,
        audioFile: audioFileFileId,
        series: req.body.series,
      });

      await newItem.save();
      res.json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.put(
  '/sermon/edit/:id',
  upload.fields([{ name: 'thumbnail' }, { name: 'audioFile' }]),
  async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });

      if (req.body.name) item.name = req.body.name;
      if (req.body.date) item.date = new Date(req.body.date);
      if (req.body.speaker) item.speaker = req.body.speaker;
      if (req.body.series) item.series = req.body.series;

      if (req.files && req.files.thumbnail) {
        if (item.thumbnail) await deleteFromDrive(item.thumbnail);
        item.thumbnail = await uploadToDrive(req.files.thumbnail[0]);
      }

      if (req.files && req.files.audioFile) {
        if (item.audioFile) await deleteFromDrive(item.audioFile);
        item.audioFile = await uploadToDrive(req.files.audioFile[0]);
      }

      await item.save();
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete('/sermon/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.thumbnail) await deleteFromDrive(item.thumbnail);
    if (item.audioFile) await deleteFromDrive(item.audioFile);

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sermon/series', async (req, res) => {
  try {
    const series = await Item.distinct('series');
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sermon/speakers', async (req, res) => {
  try {
    const speakers = await Item.distinct('speaker');
    res.json(speakers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Module 2: Event Endpoints
// ---------------------------------------------------------

// Define Event Schema & Model (using eventDB)
const eventSchema = new mongoose.Schema({
  image: String,
  title: { type: String, required: true },
  venue: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  time: String,
  description: String,
  registrationLink: String,
  televised: Boolean,
  televisedLink: String,
});
const Event = eventDB.model('Event', eventSchema);

app.post('/event/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    console.log('Event Created:', event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/event/events', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const events = await Event.find({
      $or: [
        { startDate: { $gte: today } },
        {
          $and: [
            { endDate: { $exists: true } },
            { endDate: { $gte: today } },
          ],
        },
      ],
    }).sort({ startDate: 1 });
    console.log('Fetched Events:', events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/event/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event)
      return res.status(404).json({ error: 'Event not found' });
    console.log('Event Updated:', event);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/event/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res.status(404).json({ error: 'Event not found' });
    console.log('Event Deleted:', event);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------
// Module 3: Devotional Endpoints
// ---------------------------------------------------------

// Define Devotional Schema & Model (using eventDB)
const devotionalSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  topic: String,
  speaker: String,
  content: String,
});
const Content = eventDB.model('Content', devotionalSchema);

app.post('/devotional/create', async (req, res) => {
  try {
    const newContent = new Content(req.body);
    await newContent.save();
    res.json({ message: 'Content Created', data: newContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/devotional/contents', async (req, res) => {
  try {
    const contents = await Content.find().sort({ date: -1 });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/devotional/update/:id', async (req, res) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Content Updated', data: updatedContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/devotional/delete/:id', async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Module 4: Blog Endpoints
// ---------------------------------------------------------

// Define Blog Schema & Model (using eventDB)
const blogSchema = new mongoose.Schema({
  title: String,
  category: String,
  image: String,
  body: String,
  author: String,
  date: { type: Date, default: Date.now },
  uniqueIps: { type: [String], default: [] },
});
const Blog = eventDB.model('Blog', blogSchema);

app.post('/blog/blogs', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    console.log('Blog Created:', newBlog);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/blog/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blog/blogs/:id', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { uniqueIps: ip } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ blog, uniqueIpCount: blog.uniqueIps.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blog/blogs/:id/views', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, 'uniqueIps');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ uniqueIpCount: blog.uniqueIps.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/blog/blogs/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlog)
      return res.status(404).json({ message: 'Blog not found' });
    console.log('Blog Updated:', updatedBlog);
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/blog/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog)
      return res.status(404).json({ message: 'Blog not found' });
    console.log('Blog Deleted:', deletedBlog);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blog/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/blog/authors', async (req, res) => {
  try {
    const authors = await Blog.distinct('author');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------------------------------------
// Module 5: Radio Endpoints (Schedule & Chat Session)
// ---------------------------------------------------------

// ----- Schedule -----
// Define Schedule Schema & Model (using eventDB)
// Note the new "image" field added to store an image URL
const scheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String, // New field to store an image URL
  scheduleTime: { type: Date, required: true },
  timeZone: String,
  createdAt: { type: Date, default: Date.now },
});
const Schedule = eventDB.model('Schedule', scheduleSchema);

app.post('/radio/schedule', async (req, res) => {
  try {
    const { name, description, scheduleTime, timeZone, image } = req.body;
    const newSchedule = new Schedule({
      name,
      description,
      image, // Save image URL if provided
      scheduleTime: new Date(scheduleTime),
      timeZone,
    });
    const saved = await newSchedule.save();
    console.log('Created schedule:', saved);
    res.json(saved);
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ error: 'Error creating schedule' });
  }
});

app.put('/radio/schedule/:id', async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image, // Update image URL if provided
      scheduleTime: req.body.scheduleTime
        ? new Date(req.body.scheduleTime)
        : undefined,
      timeZone: req.body.timeZone,
    };
    // Remove undefined keys
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    console.log('Updated schedule:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ error: 'Error updating schedule' });
  }
});

app.delete('/radio/schedule/:id', async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    console.log('Deleted schedule with id:', req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ error: 'Error deleting schedule' });
  }
});

app.get('/radio/schedule/all', async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ scheduleTime: -1 });
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching all schedules:', err);
    res.status(500).json({ error: 'Error fetching all schedules' });
  }
});

app.get('/radio/schedule/future', async (req, res) => {
  try {
    const now = new Date();
    const schedules = await Schedule.find({
      scheduleTime: { $gt: now },
    }).sort({ scheduleTime: 1 });
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching future schedules:', err);
    res.status(500).json({ error: 'Error fetching future schedules' });
  }
});

app.get('/radio/schedule/now', async (req, res) => {
  try {
    const now = new Date();
    const nowSchedule = await Schedule.findOne({
      scheduleTime: { $lte: now },
    }).sort({ scheduleTime: -1 });
    res.json(nowSchedule);
  } catch (err) {
    console.error('Error fetching now playing schedule:', err);
    res.status(500).json({ error: 'Error fetching now playing schedule' });
  }
});

app.get('/radio/schedule/next', async (req, res) => {
  try {
    const now = new Date();
    const nextSchedule = await Schedule.findOne({
      scheduleTime: { $gt: now },
    }).sort({ scheduleTime: 1 });
    res.json(nextSchedule);
  } catch (err) {
    console.error('Error fetching next schedule:', err);
    res.status(500).json({ error: 'Error fetching next schedule' });
  }
});

// ----- Chat Session -----
// Define Chat Comment Schema and Chat Session Schema (using eventDB)
const chatCommentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});
const chatSessionSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeZone: String,
  comments: [chatCommentSchema],
  createdAt: { type: Date, default: Date.now },
});
const ChatSession = eventDB.model('ChatSession', chatSessionSchema);

app.post('/radio/chatsession', async (req, res) => {
  try {
    const { startTime, endTime, timeZone } = req.body;
    const newSession = new ChatSession({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      timeZone,  // Save the offset
    });
    const saved = await newSession.save();
    console.log('Created chat session:', saved);
    res.json(saved);
  } catch (err) {
    console.error('Error creating chat session:', err);
    res.status(500).json({ error: 'Error creating chat session' });
  }
});

app.put('/radio/chatsession/:id', async (req, res) => {
  try {
    const updateData = {};
    if (req.body.startTime) updateData.startTime = new Date(req.body.startTime);
    if (req.body.endTime) updateData.endTime = new Date(req.body.endTime);
    if (req.body.timeZone) updateData.timeZone = req.body.timeZone; // Update the offset if provided
    const updated = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    console.log('Updated chat session:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating chat session:', err);
    res.status(500).json({ error: 'Error updating chat session' });
  }
});

app.delete('/radio/chatsession/:id', async (req, res) => {
  try {
    await ChatSession.findByIdAndDelete(req.params.id);
    console.log('Deleted chat session with id:', req.params.id);
    res.json({ message: 'Chat session deleted' });
  } catch (err) {
    console.error('Error deleting chat session:', err);
    res.status(500).json({ error: 'Error deleting chat session' });
  }
});

app.get('/radio/chatsession/all', async (req, res) => {
  try {
    const sessions = await ChatSession.find().sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching chat sessions:', err);
    res.status(500).json({ error: 'Error fetching chat sessions' });
  }
});

app.post('/radio/chatsession/:id/comment', async (req, res) => {
  try {
    const { name, comment } = req.body;
    const session = await ChatSession.findById(req.params.id);
    if (!session)
      return res.status(404).json({ error: 'Chat session not found' });
    session.comments.push({ name, comment });
    await session.save();
    console.log(`Added comment to chat session ${req.params.id}:`, { name, comment });
    res.json(session);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Error adding comment to chat session' });
  }
});

app.get('/radio/chatsession/:id/comments', async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session)
      return res.status(404).json({ error: 'Chat session not found' });
    res.json(session.comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Error fetching chat comments' });
  }
});

// ---------------------------------------------------------
// Module 6: Contact & Nodemailer Endpoints
// ---------------------------------------------------------

// Define Subscriber Schema & Model (using contactDB)
const subscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
const Subscriber = contactDB.model('Subscriber', subscriberSchema);

// Configure Nodemailer with Zoho
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465, // Use 465 for SSL (or 587 for TLS)
  secure: true,
  auth: {
    user: 'philip.ajayi@fivorne.com', // Zoho custom email
    pass: '5Skmyk258bhz', // Zoho app password
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to mail server:', error);
  } else {
    console.log('Mail server is ready to take messages');
  }
});

// Subscribers Endpoints
app.get('/contact/email', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Error fetching subscribers' });
  }
});

app.post('/contact/email', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newSub = new Subscriber({ name, email });
    await newSub.save();
    res.status(201).json(newSub);
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ message: 'Error adding subscriber' });
  }
});

app.delete('/contact/email/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Subscriber.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subscriber deleted.' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Error deleting subscriber' });
  }
});

// Church Contact Form Submission
app.post('/contact/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: '"Church Contact" <philip.ajayi@fivorne.com>',
    to: 'philip.ajayi@fivorne.com',
    subject: 'New Contact Form Submission',
    text: `You have received a new contact form submission:\n
Name: ${name}\n
Email: ${email}\n
Message: ${message}\n`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact form submitted successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// Prayer Request Submission
app.post('/contact/prayer', async (req, res) => {
  const { name, email, phone, message } = req.body;

  const mailOptions = {
    from: '"Prayer Request" <philip.ajayi@fivorne.com>',
    to: 'philip.ajayi@fivorne.com',
    subject: 'New Prayer Request Submission',
    text: `You have received a new prayer request:\n
Name: ${name}\n
Email: ${email}\n
Phone: ${phone}\n
Message: ${message}\n`,
    html: `
      <h3>New Prayer Request Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Prayer request submitted successfully.' });
  } catch (error) {
    console.error('Error sending prayer email:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// Send Subscribe Message to All Subscribers
/*
  Expected JSON body:
  {
    "subject": "Hello {name}, check out our update!",
    "body": "Dear {name}, <br/> Here is our latest news..."
  }
  The {name} placeholder will be replaced with each subscriber's name.
*/
app.post(
  '/contact/sendSubscribeMessage',
  upload.array('files'), // Allows multiple file attachments under field "files"
  async (req, res) => {
    const { subject, body } = req.body;

    // Map uploaded files to Nodemailer's attachment format
    const attachments =
      req.files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      })) || [];

    try {
      const subscribers = await Subscriber.find({});
      const sendEmails = subscribers.map(async (subscriber) => {
        const personalizedSubject = subject.replace(/{name}/g, subscriber.name);
        const personalizedBody = body.replace(/{name}/g, subscriber.name);

        const mailOptions = {
          from: '"MIV Word House" <philip.ajayi@fivorne.com>',
          to: subscriber.email,
          subject: personalizedSubject,
          text: personalizedBody,
          html: personalizedBody,
          attachments, // Attach uploaded files
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
        }
      });

      await Promise.all(sendEmails);
      res
        .status(200)
        .json({ message: 'Subscribe message sent to all subscribers.' });
    } catch (error) {
      console.error('Error sending subscribe messages:', error);
      res
        .status(500)
        .json({ message: 'Error sending subscribe messages.' });
    }
  }
);

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Fallback route to serve index.html for all unknown routes (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ---------------------------------------------------------
// Start the Server
// ---------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
