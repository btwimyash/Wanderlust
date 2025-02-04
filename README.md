🏡 Wanderlust 
Wanderlust is a web application that allows users to explore, list, and review vacation rentals. This project is inspired by Airbnb and built using Node.js, Express, MongoDB, and EJS.

✨ Features
🏠 List Properties: Users can add new rental listings with details like title, price, location, and images.
🔍 View Listings: Browse and explore various properties with images and descriptions.
⭐ Reviews & Ratings: Users can leave reviews and ratings for properties.
✏️ Edit & Delete Listings: Property owners can update or remove their listings.
📱 Responsive UI: The frontend is designed using Bootstrap and EJS templates.
🛠 Technologies Used
🖥 Backend: Node.js, Express.js
🎨 Frontend: EJS, Bootstrap
🗄 Database: MongoDB (Mongoose ORM)
🔄 Middleware: Method-Override, Joi for validation
🚀 Installation & Setup
📌 Prerequisites
Make sure you have the following installed on your system:

✅ Node.js (v14+ recommended)
✅ MongoDB (local or cloud-based)
✅ Git (optional)

🔧 Steps to Run Locally
1️⃣ Clone the Repository
bash
Copy
git clone https://github.com/YOUR_GITHUB_USERNAME/wanderlust.git
cd wanderlust
2️⃣ Install Dependencies
bash
Copy
npm install
3️⃣ Set Up MongoDB
Run MongoDB locally or use a cloud-based service like MongoDB Atlas.
Update the database connection URL in index.js:
javascript
Copy
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
4️⃣ Start the Server
bash
Copy
npm start
🚀 The server will run on http://localhost:8081

📂 Project Structure
csharp
Copy
📦 wanderlust
├── 📁 models         # Mongoose models (Listing, Review)
├── 📁 routes         # Express route handlers
├── 📁 views          # EJS templates
├── 📁 public         # Static assets (CSS, JS, images)
├── 📁 utils          # Utility functions (error handling, middleware)
├── 📄 index.js       # Main server file
├── 📄 schema.js      # Joi validation schemas
└── 📄 README.md      # Project documentation
📌 API Routes
🏡 Listings
Route	Method	Description
/listings	GET	Get all listings
/listings/new	GET	Show form to create a new listing
/listings	POST	Create a new listing
/listings/:id	GET	Show details of a specific listing
/listings/:id/edit	GET	Show edit form for a listing
/listings/:id	PUT	Update a listing
/listings/:id	DELETE	Delete a listing
⭐ Reviews
Route	Method	Description
/listings/:id/reviews	POST	Add a review
🤝 Contributing
Feel free to fork this repository and submit pull requests. Here’s how you can contribute:

1️⃣ Fork the project
2️⃣ Create a feature branch

bash
Copy
git checkout -b feature-name
3️⃣ Commit your changes

bash
Copy
git commit -m 'Add feature'
4️⃣ Push to the branch

bash
Copy
git push origin feature-name
5️⃣ Open a Pull Request

📜 License
This project is open-source and available under the MIT License. 📝

