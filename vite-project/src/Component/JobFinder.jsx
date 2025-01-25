import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JobFinder.css";

const JobFinder = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    experience: "",
    jobRole: "",
    company: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formId, setFormId] = useState(null); 

  const jobRoles = {
    Developer: ["Google", "Microsoft", "Facebook"],
    Designer: ["Adobe", "Figma", "Canva"],
    Marketer: ["HubSpot", "Salesforce", "LinkedIn"],
  };

  const jobKeypoints = {
    Google: "Strong coding skills, teamwork, and innovation.",
    Microsoft: "Proficiency in .NET, collaboration, and problem-solving.",
    Facebook: "Experience in React, creativity, and adaptability.",
    Adobe: "Design thinking, UI/UX expertise, and software proficiency.",
    Figma: "Collaboration skills, prototyping knowledge, and innovation.",
    Canva: "Graphic design, teamwork, and user-focused approach.",
    HubSpot: "Marketing automation skills, communication, and strategy.",
    Salesforce: "CRM expertise, data analysis, and leadership.",
    LinkedIn: "Social media marketing, networking, and content creation."
  };

  useEffect(() => {
    const fetchJobdata = async () => {
      try {
        const response = await axios.get("https://api-mirana.azurewebsites.net/api/formdata");
        if (response.data.length > 0) {
          const data = response.data[0];
          setFormData(data);
          setFormId(data._id); 
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchJobdata();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobRole) {
      alert("Please select a job role before submitting!");
      return;
    }
    try {
      if (formId) {
        await axios.put(`https://api-mirana.azurewebsites.net/api/formdata/${formId}`, formData);
        console.log("Form Data Updated:", formData);
      } else {
        const response = await axios.post("https://api-mirana.azurewebsites.net/api/formdata", formData);
        setFormId(response.data._id);
        console.log("Form Data Submitted:", formData);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleFinish = () => {
    setFormData({
      name: "",
      age: "",
      email: "",
      experience: "",
      jobRole: "",
      company: "",
    });
    setFormId(null);
    setIsSubmitted(false);
  };

  const JobForm = () => {
    return (
      <div className="jobForm">
        <h1>Job Application Review</h1>
        <p>Thank you for signing up!</p>
        {formData.name && <p>Full Name: {formData.name}</p>}
        {formData.age && <p>Age: {formData.age}</p>}
        {formData.email && <p>Email: {formData.email}</p>}
        {formData.experience && <p>Experience: {formData.experience} years</p>}
        {formData.jobRole && <p>Job Role: {formData.jobRole}</p>}
        {formData.company && <p>Preferred Company: {formData.company}</p>}
        {formData.company && <p>Key Points: {jobKeypoints[formData.company]}</p>}
        <button onClick={handleFinish}>Confirm</button>
      </div>
    );
  };

  return (
    <div className="form-container">
      {isSubmitted ? (
        <JobForm />
      ) : (
        <div className="form-card">
          <h1>Job Finder Form</h1>
          <p>Fill out the details to apply for a job</p>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Full Name:
                <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              </label>
            </div>
            <div className="form-field">
              <label>Age:
                <input type="text" name="age" placeholder="Enter your age" value={formData.age} onChange={handleChange} required />
              </label>
            </div>
            <div className="form-field">
              <label>Email:
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
              </label>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Experience (Years):
                  <input type="text" name="experience" placeholder="Enter your experience" value={formData.experience} onChange={handleChange} required />
                </label>
              </div>
              <div className="form-field">
                <label>Job Role:
                  <select name="jobRole" value={formData.jobRole} onChange={handleChange} required>
                    <option value="">Select a Job Role</option>
                    {Object.keys(jobRoles).map((role, index) => (
                      <option key={index} value={role}>{role}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-field">
                <label>Preferred Company:
                  <select name="company" value={formData.company} onChange={handleChange} required>
                    <option value="">Select a Company</option>
                    {formData.jobRole && jobRoles[formData.jobRole].map((company, index) => (
                      <option key={index} value={company}>{company}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobFinder;
