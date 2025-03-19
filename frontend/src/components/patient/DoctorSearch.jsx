import React, { useState, useEffect } from 'react';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const sampleDoctors = {
      "professionals": [
        {
            name: "Dr. Smiles Dental Hospitals",
            specialist: "dentist",
            recommended_by: "AD",
            review_count: 2320,
            years_of_experience: "8 - 29",
            location: "Vidyanagar",
            consultation_fee: 300,
            patient_stories: "99%",
            availability: "Book Clinic Visit",
            clinics: null,
            booking_options: null,
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SW5kaWFuJTIwZG9jdG9yfGVufDB8fDB8fHww",
          },
          {
            name: "Dr. G.Chandra Sekhar",
            specialist: "dentist",
            recommended_by: "98%",
            review_count: 195,
            years_of_experience: 35,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Dr. G Chandra Sekhar's Dental Hospital", "Another Clinic"],
            consultation_fee: 500,
            patient_stories: "98%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Hospital"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. K Kiran Kumar",
            specialist: "dentist",
            recommended_by: "99%",
            review_count: 829,
            years_of_experience: 29,
            location: "Vidyanagar, Hyderabad",
            clinics: ["Dr. Smiles Dental Hospitals", "Clinic 2", "Clinic 3"],
            consultation_fee: 300,
            patient_stories: "99%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Hospital"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Usha Kiran",
            specialist: "dentist",
            recommended_by: "99%",
            review_count: 432,
            years_of_experience: 27,
            location: "Vidyanagar, Hyderabad",
            clinics: ["Dr. Smiles Dental Hospitals", "Another Clinic"],
            consultation_fee: 300,
            patient_stories: "99%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Hospital"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Aditya Sandeep Kodati",
            specialist: "dentist",
            recommended_by: "98%",
            review_count: 144,
            years_of_experience: 18,
            location: "Domalguda, Hyderabad",
            clinics: ["Anita Krishna Dental Clinic"],
            consultation_fee: 400,
            patient_stories: "98%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Naresh Kumar V",
            specialist: "dentist",
            recommended_by: "99%",
            review_count: 432,
            years_of_experience: 20,
            location: "Nallakunta, Hyderabad",
            clinics: ["Viva Smilez Dental Hospital"],
            consultation_fee: 300,
            patient_stories: "99%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Hospital"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Arvind Nahata",
            specialist: "dentist",
            recommended_by: "99%",
            review_count: 178,
            years_of_experience: 13,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Diamond Multispeciality Dental Clinic"],
            consultation_fee: 660,
            patient_stories: "99%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Geetha Rani Kodati",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 1,
            years_of_experience: 18,
            location: "Domalguda, Hyderabad",
            clinics: ["Anita Krishna Dental Clinic"],
            consultation_fee: 400,
            patient_stories: "100%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Namratha CH",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 2,
            years_of_experience: 13,
            location: "Narayanguda, Hyderabad",
            clinics: ["Dental Care Centre"],
            consultation_fee: 500,
            patient_stories: "100%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Ahmed Syed Mubashir",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 2,
            years_of_experience: 10,
            location: "Lakdikapul, Hyderabad",
            clinics: ["Ahmed Dental Care"],
            consultation_fee: 300,
            patient_stories: "100%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. C V Sarath Krishna",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 2,
            years_of_experience: 10,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Smile Kreations"],
            consultation_fee: 500,
            patient_stories: "100%",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Yashvanth Bethapudi",
            specialist: "dentist",
            recommended_by: "99%",
            review_count: 994,
            years_of_experience: 15,
            location: "Ramkoti, Hyderabad",
            clinics: ["Dr Smiles Dental Clinic Ramkote", "Clinic 2", "Clinic 3", "Clinic 4"],
            consultation_fee: 300,
            patient_stories: "99%",
            availability: "Available Tomorrow",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Clinic"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. K Rohini",
            specialist: "dentist",
            recommended_by: null,
            review_count: null,
            years_of_experience: 12,
            location: "Nallakunta, Hyderabad",
            clinics: ["Partha Dental Skin Hair"],
            consultation_fee: 500,
            patient_stories: null,
            availability: "Available Today",
            booking_options: ["Book Clinic Visit", "No Booking Fee", "Contact Hospital"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Taufiq Munshi",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 3,
            years_of_experience: 28,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Tooth Care"],
            consultation_fee: 500,
            patient_stories: "100%",
            availability: "Contact Clinic",
            booking_options: ["Book Video Consult"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. V.Bhadra Rao",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 18,
            years_of_experience: 27,
            location: "Ramkoti, Hyderabad",
            clinics: ["Dr Smiles Dental Clinic Ramkote"],
            consultation_fee: 300,
            patient_stories: "100%",
            availability: "ON - CALL",
            booking_options: ["Contact Clinic", "View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Syed Ali Hasnain",
            specialist: "dentist",
            recommended_by: "97%",
            review_count: 37,
            years_of_experience: 8,
            location: "Ramkoti, Hyderabad",
            clinics: ["Dr Smiles Dental Clinic Ramkote", "Another Clinic"],
            consultation_fee: 300,
            patient_stories: "97%",
            availability: "Contact Clinic",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. G Hemamalini",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 1,
            years_of_experience: 7,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Smile Kreations"],
            consultation_fee: 500,
            patient_stories: "100%",
            availability: "Contact Clinic",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Naveen Kumar Reddy K",
            specialist: "dentist",
            recommended_by: null,
            review_count: null,
            years_of_experience: 14,
            location: "Himayat Nagar, Hyderabad",
            clinics: ["Smile Kreations"],
            consultation_fee: 500,
            patient_stories: null,
            availability: "Contact Clinic",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Riya Goyal",
            specialist: "dentist",
            recommended_by: null,
            review_count: null,
            years_of_experience: 9,
            location: "Ramkoti, Hyderabad",
            clinics: ["Dr Smiles Dental Clinic Ramkote"],
            consultation_fee: 300,
            patient_stories: null,
            availability: "Contact Clinic",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. D Shirisha",
            specialist: "dentist",
            recommended_by: "100%",
            review_count: 8,
            years_of_experience: 8,
            location: "Vidyanagar, Hyderabad",
            clinics: ["Dr. Smiles Dental Hospitals"],
            consultation_fee: 300,
            patient_stories: "100%",
            availability: "Contact Hospital",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Alekhya A",
            specialist: "dentist",
            recommended_by: null,
            review_count: null,
            years_of_experience: 11,
            location: "Nallakunta, Hyderabad",
            clinics: ["Apollo Dental"],
            consultation_fee: 500,
            patient_stories: null,
            availability: "Contact Clinic",
            booking_options: ["View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Sivavenkata Malati Nalli",
            specialist: "dentist",
            recommended_by: "98%",
            review_count: 46,
            years_of_experience: 18,
            location: "Ramkoti, Hyderabad",
            clinics: ["Dr Smiles Dental Clinic Ramkote", "Clinic 2", "Clinic 3", "Clinic 4", "Clinic 5", "Clinic 6", "Clinic 7"],
            consultation_fee: 300,
            patient_stories: "98%",
            availability: "ON - CALL",
            booking_options: ["Contact Clinic", "View Profile"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Birla Fertility & IVF",
            specialist: "gynecologist",
            recommended_by: null,
            review_count: null,
            years_of_experience: "12 - 17 years",
            location: "Banjara Hills, Hyderabad",
            clinics: null,
            consultation_fee: "0 (Free Consultation)",
            patient_stories: "11",
            availability: "Available",
            booking_options: ["Book Clinic Visit"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Sridevi Gutta",
            specialist: "gynecologist",
            recommended_by: null,
            review_count: null,
            years_of_experience: "24 years",
            location: "Kachiguda, Hyderabad",
            clinics: ["Prathima Hospitals", "Another Clinic"],
            consultation_fee: "600",
            patient_stories: "52",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Roopa Ghanta",
            specialist: "gynecologist",
            recommended_by: null,
            review_count: null,
            years_of_experience: "30 years",
            location: "Banjara Hills, Hyderabad",
            clinics: ["Little Stars and She Hospital", "Another Clinic"],
            consultation_fee: "600",
            patient_stories: "111",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            name: "Dr. Narla Ashwani",
            specialist: "gynecologist",
            recommended_by: null,
            review_count: null,
            years_of_experience: "9 years",
            location: "Nallakunta, Hyderabad",
            clinics: ["Seasons Hospital"],
            consultation_fee: "600",
            patient_stories: "1",
            availability: "Available Today",
            booking_options: ["Book Clinic Visit"],
            image: "https://images.pexels.com/photos/8376181/pexels-photo-8376181.jpeg?auto=compress&cs=tinysrgb&w=600",
          },
          {
            "name": "Dr. V Hemalatha Reddy",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "14 years",
            "location": "Basheerbagh, Hyderabad",
            "clinics": ["Hope Children's Hospital"],
            "consultation_fee": "800",
            "patient_stories": null,
            "availability": "Available Today",
            "booking_options": ["Book Clinic Visit"]
          },
          {
            "name": "Dr. Manav Chintawar",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "9 years",
            "location": "Ramanthapur, Hyderabad",
            "clinics": ["Manasa Hospital"],
            "consultation_fee": "300",
            "patient_stories": "3",
            "availability": "Available Today",
            "booking_options": ["Book Clinic Visit"]
          },
          {
            "name": "Dr. Amishrita Chintawar",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "12 years",
            "location": "Ramanthapur, Hyderabad",
            "clinics": ["Manasa Hospital"],
            "consultation_fee": "400",
            "patient_stories": "16",
            "availability": "Available Tomorrow",
            "booking_options": ["Book Clinic Visit"]
          },
          {
            "name": "Dr. Pushpalata Damaraju",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "57 years",
            "location": "Himayat Nagar, Hyderabad",
            "clinics": ["Lakshmi Hospital & Research Centre"],
            "consultation_fee": "500",
            "patient_stories": "133",
            "availability": null,
            "booking_options": ["Contact Hospital"]
          },
          {
            "name": "Dr. Sagi Swathi",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "16 years",
            "location": "Himayat Nagar, Hyderabad",
            "clinics": ["Women's Health and Fertility Clinic"],
            "consultation_fee": "500",
            "patient_stories": "5",
            "availability": "Available on Fri, 21 Mar",
            "booking_options": ["Book Clinic Visit"]
          },
          {
            "name": "Dr. M Beulah",
            "specialist": "gynecologist",
            "recommended_by": null,
            "review_count": null,
            "years_of_experience": "12 years",
            "location": "Banjara Hills, Hyderabad",
            "clinics": ["Virinchi Hospitals", "Another Clinic"],
            "consultation_fee": "800",
            "patient_stories": null,
            "availability": null,
            "booking_options": null
          }
      ]
    };

    // Add a unique id to each doctor
    const doctorsWithId = sampleDoctors.professionals.map((doctor, index) => ({
        ...doctor,
        id: index + 1,
      }));
    
      console.log("Initial Doctors:", doctorsWithId); // Check if data is correct
      setDoctors(doctorsWithId);
      setFilteredDoctors(doctorsWithId);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = doctors.filter((doctor) => {
          const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
          const locationMatch = doctor.location.toLowerCase().includes(searchLocation.toLowerCase());
          return (!searchTerm || nameMatch) && (!searchLocation || locationMatch);
        });
        console.log("Filtered Doctors:", filtered); // Check filtered results
        setFilteredDoctors(filtered);
      };

  const resetSearch = () => {
    setSearchTerm("");
    setSearchLocation("");
    setFilteredDoctors(doctors);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Healthcare Provider
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with experienced doctors in your area. Book appointments instantly and take control of your health journey.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                    Doctor Name or Specialty
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="doctor"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Dr. Beulah or Gynecologist"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Banjara Hills, Hyderabad"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Search Doctors
                </button>
                <button
                  type="button"
                  onClick={resetSearch}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filteredDoctors.length} Available Doctors
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex">
                  <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                    <img
                      src={doctor.image} // Placeholder image
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                        <p className="text-indigo-600 font-medium">{doctor.specialist}</p>
                      </div>
                      {doctor.recommended_by && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {doctor.recommended_by}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {doctor.years_of_experience} years of experience
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {doctor.location}
                      </div>

                      {doctor.clinics && (
                        <div className="flex items-center text-gray-600">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {doctor.clinics.join(", ")}
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ₹{doctor.consultation_fee}
                      </div>
                    </div>

                    {doctor.review_count && (
                      <div className="mt-4 text-sm text-gray-500">
                        {doctor.review_count} Patient Reviews
                      </div>
                    )}

                    <button
                      className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No doctors found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search criteria or reset the filters.</p>
                <button
                  onClick={resetSearch}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;