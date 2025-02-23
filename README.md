# System Rezerwacji - App Flow and Features

## Overview
The System Rezerwacji app is designed to help users book their trips by showcasing a diverse collection of Airbnb listings. The app emphasizes visual appeal and user-friendliness, presenting high-quality images of various accommodations to attract potential guests.

## Tech Stack
Frontend: React Native with Typescript, Expo and Expo router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: Deepseek

## App Flow

1. **Home Screen**
   - **Image Grid**: Upon opening the app, users are greeted with a grid layout of diverse Airbnb listing images. These images include interiors and exteriors of homes and experiences, each with unique decor and styles.
   - **Visual Appeal**: The images feature warm, inviting lighting to emphasize comfortable settings. Neutral backgrounds and light colors highlight the subjects in the photos.

2. **Listing Details**
   - **Image Gallery**: Users can click on any listing image to view a detailed gallery of high-quality photos showcasing the unique character and atmosphere of the property.
   - **Property Information**: Detailed descriptions of the property, including amenities, location, and pricing, are provided.

3. **Booking Process**
   - **Availability Check**: Users can check the availability of the property for their desired dates.
   - **Booking Form**: A user-friendly booking form allows users to enter their details and confirm their reservation.
   - **Payment Gateway**: Secure payment options are integrated to facilitate the booking process.
   - **Notifications**: Users receive e-mail or SMS notifications to confirm their booking and provide updates.

4. **User Account**
   - **Profile Management**: Users can create and manage their profiles, including personal information and booking history.
   - **Favorites**: Users can save their favorite listings for future reference.

5. **Dynamic Pricing**
   - **Demand Analysis**: The app includes a dynamic pricing mechanism that adjusts prices based on demand analysis to optimize revenue.

## Features

- **High-Quality Photography**: The app uses high-quality images to showcase the unique decor and styles of each property.
- **Modern Design**: The overall style is modern and user-friendly, with a focus on visual appeal.
- **Secure Booking**: Integrated secure payment gateways ensure a safe booking process.
- **User Profiles**: Users can manage their profiles and view their booking history.
- **Favorites**: Users can save and easily access their favorite listings.
- **Notifications**: E-mail or SMS notifications keep users informed about their bookings.
- **Dynamic Pricing**: Prices are adjusted dynamically based on demand analysis.

## Optimal Folder Structure

The optimal folder structure for the System Rezerwacji app ensures a clean and organized codebase, making it easier to manage and scale.

```
/System-rezerwacji
|-- /app
|   |-- /Controllers
|   |-- /Models
|   |-- /Views
|-- /config
|-- /database
|   |-- /migrations
|   |-- /seeds
|-- /public
|   |-- /css
|   |-- /js
|-- /resources
|   |-- /views
|-- /routes
|-- /storage
|-- /tests
|-- /vendor
|-- .env
|-- .gitignore
|-- composer.json
|-- package.json
|-- README.md

```

### Description of Folders

- **/app**: Contains the core application code, including controllers, models, and views.
- **/config**: Configuration files for the application.
- **/database**: Database migrations and seeds.
- **/public**: Publicly accessible files such as CSS, JavaScript, and images.
- **/resources**: Resources such as views and language files.
- **/routes**: Route definitions for the application.
- **/storage**: Storage for logs, file uploads, and other generated files.
- **/tests**: Test cases for the application.
- **/vendor**: Composer dependencies.



## Conclusion
The System Rezerwacji app provides a seamless and visually appealing experience for users looking to book their trips. By focusing on high-quality photography and a user-friendly interface, the app aims to attract potential guests and simplify the booking process.
