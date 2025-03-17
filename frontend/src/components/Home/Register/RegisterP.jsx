import { supabase } from "../../../supabase.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Replacing useRouter()

export default function PatientProfile() {
  const {id: patientId } = useParams(); // Get patientId from the URL

  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [relation, setRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [language, setLanguage] = useState("");
  const [communication, setCommunication] = useState("");

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) {
      console.error("Error fetching patient data:", error);
    } else {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setEmail(data.email || "");
      setDateOfBirth(data.dob || "");
      setSex(data.sex || "");
      setPhone(data.phone_number || "");
      setAddress(data.address || "");
      setNationality(data.nationality || "");
      setBloodGroup(data.blood_group || "");
      setHeight(data.height || "");
      setWeight(data.weight || "");
      setAllergies(data.allergies || "");
      setConditions(data.existing_conditions || "");
      setMedications(data.current_medication || "");
      setFamilyHistory(data.family_med_history || "");
      setEmergencyName(data.emergency_cont_name || "");
      setRelation(data.emergency_relation || "");
      setEmergencyPhone(data.emergency_contact || "");
      setEmergencyEmail(data.emergency_email || "");
      setLifestyle(data.life_style || "");
      setLanguage(data.preferred_lang || "");
      setCommunication(data.communication_pref || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      console.error("Patient ID not found in URL");
      return;
    }

    const profileData = {
      id: patientId,
      email,
      first_name: firstName,
      last_name: lastName,
      dob: dateOfBirth,
      sex,
      phone_number: phone,
      address,
      nationality,
      blood_group: bloodGroup,
      height,
      weight,
      allergies,
      existing_conditions: conditions,
      current_medication: medications,
      family_med_history: familyHistory,
      emergency_cont_name: emergencyName,
      emergency_relation: relation,
      emergency_contact: emergencyPhone,
      emergency_email: emergencyEmail,
      life_style: lifestyle,
      preferred_lang: language,
      communication_pref: communication,
    };

    const { data, error } = await supabase
      .from("patients")
      .upsert([profileData], { onConflict: ["id"] });

    if (error) {
      console.error("Error saving patient profile:", error);
    } else {
      console.log("Profile saved successfully:", data);
    }
  };


  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Patient Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">Personal Information</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-blue-600">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-blue-600">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dob" className="block text-sm font-medium text-blue-600">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                placeholder="dd-mm-yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sex" className="block text-sm font-medium text-blue-600">
                Sex
              </label>
              <select
                id="sex"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-blue-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-blue-600">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-blue-600">
                Address
              </label>
              <textarea
                id="address"
                placeholder="Address"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="nationality" className="block text-sm font-medium text-blue-600">
                Nationality
              </label>
              <input
                id="nationality"
                type="text"
                placeholder="Nationality"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Health Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">Health Details</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-blue-600">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">Blood Group</option>
                <option value="a+">A+</option>
                <option value="a-">A-</option>
                <option value="b+">B+</option>
                <option value="b-">B-</option>
                <option value="ab+">AB+</option>
                <option value="ab-">AB-</option>
                <option value="o+">O+</option>
                <option value="o-">O-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="block text-sm font-medium text-blue-600">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                placeholder="Height (cm)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="block text-sm font-medium text-blue-600">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                placeholder="Weight (kg)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="allergies" className="block text-sm font-medium text-blue-600">
                Known Allergies
              </label>
              <textarea
                id="allergies"
                placeholder="Known Allergies"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="conditions" className="block text-sm font-medium text-blue-600">
                Existing Conditions
              </label>
              <textarea
                id="conditions"
                placeholder="Existing Conditions"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="medications" className="block text-sm font-medium text-blue-600">
                Current Medications
              </label>
              <textarea
                id="medications"
                placeholder="Current Medications"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="familyHistory" className="block text-sm font-medium text-blue-600">
                Family Medical History
              </label>
              <textarea
                id="familyHistory"
                placeholder="Family Medical History"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">Emergency Contact</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="emergencyName" className="block text-sm font-medium text-blue-600">
                Emergency Contact Name
              </label>
              <input
                id="emergencyName"
                type="text"
                placeholder="Contact Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="relation" className="block text-sm font-medium text-blue-600">
                Relation
              </label>
              <input
                id="relation"
                type="text"
                placeholder="Relation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-blue-600">
                Phone Number
              </label>
              <input
                id="emergencyPhone"
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emergencyEmail" className="block text-sm font-medium text-blue-600">
                Email
              </label>
              <input
                id="emergencyEmail"
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={emergencyEmail}
                onChange={(e) => setEmergencyEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">Preferences</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="lifestyle" className="block text-sm font-medium text-blue-600">
                Lifestyle Habits
              </label>
              <textarea
                id="lifestyle"
                placeholder="Lifestyle Habits"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium text-blue-600">
                Preferred Language
              </label>
              <select
                id="language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Preferred Language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
                <option value="hindi">Hindi</option>
                <option value="arabic">Arabic</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="communication" className="block text-sm font-medium text-blue-600">
                Communication Preferences
              </label>
              <select
                id="communication"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={communication}
                onChange={(e) => setCommunication(e.target.value)}
              >
                <option value="">Communication Preferences</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
                <option value="mail">Mail</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}

