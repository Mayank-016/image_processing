# Node.js Image Processor

This Node.js application processes SKU data from CSV files, compresses images, and interacts with a webhook URL if provided. It uses Mongoose for database interactions, Cloudinary for file uploads, and Sharp for image compression.

## Prerequisites

- Node.js
- MongoDB
- Cloudinary Account (for file uploads)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Mayank-016/image_processing.git
   cd image_processing
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory using the `env.example` as a template:

   ```bash
   PORT=8000
   MONGO_URL=<your-mongodb-connection-string>
   DB_NAME=<your-database-name>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

## API Endpoints

### 1. Upload SKU

- **Endpoint:** `POST /api/v1/upload-sku`
- **Description:** Uploads a CSV file with SKU data, compresses images, and handles the webhook URL if provided.

- **Request Format:**

  ```plaintext
  S.No.,Product Name,Input Image Urls
  1,SKU1,"https://via.placeholder.com/150, https://via.placeholder.com/200, https://via.placeholder.com/250"
  2,SKU2,"https://via.placeholder.com/300, https://via.placeholder.com/350, https://via.placeholder.com/400"
  ```

  Optionally, include `webhookUrl` in the request.

- **Response:**

  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Success",
    "data": {
      "orderId": "<unique-order-id>"
    }
  }
  ```

  - `orderId` can be used to track the status of the processing job.

### 2. Get SKU Status

- **Endpoint:** `GET /api/v1/get-sku?orderId=<orderId>`
- **Description:** Returns the processing status of the SKU data and provides a CSV URL if processing is completed.

- **Request Example:**

  ```http
  GET http://localhost:8000/api/v1/get-sku?orderId=66d3129140e8e9a514ae56d5
  ```

- **Response:**

  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Success",
    "data": {
      "status": "completed",
      "fileUrl": "http://res.cloudinary.com/dfuznzpu0/raw/upload/v1725108892/csv/katwssb42dzbwplc83no.csv"
    }
  }
  ```

  - `status` indicates whether the processing is "completed" or still in progress.
  - `fileUrl` is the URL to the new CSV file with the output image URLs.

## Functionality

1. **CSV File Processing:**

   - The uploaded CSV file is parsed to extract SKU data and image URLs.
   - Images are downloaded and compressed using the Sharp package.
   - SKU data and image processing status are saved to a MongoDB database.
   - If a `webhookUrl` is provided, it is hit with a success message once image processing is complete.

2. **Job Tracking:**

   - An `orderId` is generated for each processing job. Use this ID to check the status of the processing job.
   - The status of each job is tracked, and the processing happens in the background.

3. **Completed Jobs:**

   - Upon completion, the system provides a new CSV file URL with an additional column containing the output image URLs.
   - This CSV file is also saved on Cloudinary, and its URL is provided in the response.

## Running the Application

1. **Start MongoDB:**

   Ensure that MongoDB is running.

2. **Run the Application:**

   ```bash
   npm run dev/prod
   ```

3. **Access the API:**

   The application will be available at `http://localhost:8000`.

## Postman Collection
```bash
https://www.postman.com/science-participant-50153919/workspace/api-collections/collection/27419417-ae18bb9c-6e1b-4f31-84b7-c3d2a974d6cb?action=share&creator=27419417
```
